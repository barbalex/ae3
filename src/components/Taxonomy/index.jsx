import { useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdEdit as EditIcon, MdVisibility as ViewIcon } from 'react-icons/md'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import styled from '@emotion/styled'
import format from 'date-fns/format'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { PropertyReadOnly } from '../shared/PropertyReadOnly.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Property } from './PropertyArten.jsx'
import { PropertyLr } from './PropertyLr.jsx'
import { onBlurArten } from './onBlurArten.js'
import { onBlurLr } from './onBlurLr.js'
import storeContext from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { constants } from '../../modules/constants.js'

const Container = styled.div`
  padding: 10px;
  column-width: ${constants.columnWidth}px;
`
const CardEditButton = styled(IconButton)`
  align-self: flex-end;
  :hover {
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.12);
    text-decoration: none;
  }
`
const StyledFormControl = styled(FormControl)`
  margin: 5px 0 5px 0 !important;
  display: block;
  > div {
    width: 100%;
  }
`

const allUsersQuery = gql`
  query AllUsersQuery {
    allUsers {
      totalCount
      nodes {
        id
        name
        email
        organizationUsersByUserId {
          nodes {
            id
            organizationId
            role
            organizationByOrganizationId {
              id
              name
            }
          }
        }
      }
    }
  }
`
const taxQuery = gql`
  query taxQuery($taxId: UUID!) {
    taxonomyById(id: $taxId) {
      id
      name
      description
      links
      lastUpdated
      organizationId
      organizationByOrganizationId {
        id
        name
        organizationUsersByOrganizationId {
          nodes {
            id
            role
            userId
            userByUserId {
              id
              name
            }
          }
        }
      }
      importedBy
      userByImportedBy {
        id
        name
      }
      termsOfUse
      habitatLabel
      habitatComments
      habitatNrFnsMin
      habitatNrFnsMax
      type
    }
  }
`

export const Taxonomy = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const { editingTaxonomies, setEditingTaxonomies, login, scrollIntoView } =
    store
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const taxId = activeNodeArray?.[1] || '99999999-9999-9999-9999-999999999999'
  const queryClient = useQueryClient()

  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(allUsersQuery)
  const {
    data: taxData,
    loading: taxLoading,
    error: taxError,
  } = useQuery(taxQuery, {
    variables: {
      taxId,
    },
  })

  const tax = taxData?.taxonomyById
  const importedByName = tax?.userByImportedBy?.name
  const organizationName = tax?.organizationByOrganizationId?.name
  const editing = editingTaxonomies
  const editingArten = editing && tax?.type === 'ART'
  const editingLr = editing && tax?.type === 'LEBENSRAUM'
  const { username } = login
  const allUsers = allUsersData?.allUsers?.nodes ?? []
  const user = allUsers.find((u) => u.name === username)
  const orgsUserIsTaxWriter = (user?.organizationUsersByUserId?.nodes ?? [])
    .filter((o) => ['orgTaxonomyWriter', 'orgAdmin'].includes(o.role))
    .map((o) => ({
      id: o.organizationId,
      name: o?.organizationByOrganizationId?.name ?? '',
    }))
  const userIsTaxWriter = orgsUserIsTaxWriter.length > 0
  const userIsThisTaxWriter =
    !!orgsUserIsTaxWriter.find((o) => o.id === tax?.organizationId) ||
    (userIsTaxWriter && !tax?.organizationId)

  const onClickStopEditing = (event) => {
    event.stopPropagation()
    setEditingTaxonomies(false)
  }

  const onClickStartEditing = (event) => {
    event.stopPropagation()
    setEditingTaxonomies(true)
  }

  const onChangeImportedByArten = (event) =>
    onBlurArten({
      apolloClient,
      queryClient,
      scrollIntoView,
      field: 'importedBy',
      taxonomy: tax,
      value: event.target.value,
      prevValue: tax.importedBy,
    })

  const onChangeOrganizationArten = (event) =>
    onBlurArten({
      apolloClient,
      queryClient,
      scrollIntoView,
      field: 'organizationId',
      taxonomy: tax,
      value: event.target.value,
      prevValue: tax.organizationId,
    })

  const onChangeImportedByLr = (event) =>
    onBlurLr({
      apolloClient,
      queryClient,
      scrollIntoView,
      field: 'importedBy',
      taxonomy: tax,
      value: event.target.value,
      prevValue: tax.importedBy,
    })

  const onChangeOrganizationLr = (event) =>
    onBlurLr({
      apolloClient,
      queryClient,
      scrollIntoView,
      field: 'organizationId',
      taxonomy: tax,
      value: event.target.value,
      prevValue: tax.organizationId,
    })

  if (taxLoading || allUsersLoading) {
    return <Spinner />
  }
  if (taxError) {
    return <Container>{`Fehler: ${taxError.message}`}</Container>
  }
  if (allUsersError) {
    return <Container>{`Fehler: ${allUsersError.message}`}</Container>
  }

  if (!tax?.id) return null

  return (
    <ErrorBoundary>
      <Container>
        {userIsThisTaxWriter && editing && (
          <CardEditButton
            aria-label="Daten anzeigen"
            title="Daten anzeigen"
            onClick={onClickStopEditing}
          >
            <Icon>
              <ViewIcon />
            </Icon>
          </CardEditButton>
        )}
        {userIsThisTaxWriter && !editing && (
          <CardEditButton
            aria-label="Daten bearbeiten"
            title="Daten bearbeiten"
            onClick={onClickStartEditing}
          >
            <Icon>
              <EditIcon />
            </Icon>
          </CardEditButton>
        )}
        {!editing && (
          <>
            <PropertyReadOnly
              key="id"
              value={tax.id}
              label="ID"
            />
            {!!tax.name && (
              <PropertyReadOnly
                key="name"
                value={tax.name}
                label="Name"
              />
            )}
            {!!tax.description && (
              <PropertyReadOnly
                key="description"
                value={tax.description}
                label="Beschreibung"
              />
            )}
            {!!tax.links && (
              <PropertyReadOnly
                key="links"
                value={tax.links.join(', ')}
                label="Links"
              />
            )}
            {!!tax.lastUpdated && (
              <PropertyReadOnly
                key="lastUpdated"
                value={format(new Date(tax.lastUpdated), 'dd.MM.yyyy')}
                label="Zuletzt aktualisiert"
              />
            )}
            {!!tax.termsOfUse && (
              <PropertyReadOnly
                key="termsOfUse"
                value={tax.termsOfUse}
                label="Nutzungsbedingungen"
              />
            )}
            {!!importedByName && (
              <PropertyReadOnly
                key="userByImportedBy"
                value={importedByName}
                label="Importiert von"
              />
            )}
            {!!organizationName && (
              <PropertyReadOnly
                key="organizationByOrganizationId"
                value={organizationName}
                label="Zuständige Organisation"
              />
            )}
            {!!tax.habitatLabel && (
              <PropertyReadOnly
                key="habitatLabel"
                value={tax.habitatLabel}
                label="Label"
              />
            )}
            {!!tax.habitatNrFnsMin && (
              <PropertyReadOnly
                key="habitatNrFnsMin"
                value={tax.habitatNrFnsMin}
                label="FNS-Nr. von"
              />
            )}
            {!!tax.habitatNrFnsMax && (
              <PropertyReadOnly
                key="habitatNrFnsMax"
                value={tax.habitatNrFnsMax}
                label="FNS-Nr. bis"
              />
            )}
            {!!tax.habitatComments && (
              <PropertyReadOnly
                key="habitatComments"
                value={tax.habitatComments}
                label="Bemerkungen"
              />
            )}
          </>
        )}
        {editingArten && (
          <>
            <Property
              key={`${tax.id}/id`}
              label="ID"
              field="id"
              taxonomy={tax}
              disabled={true}
            />
            <Property
              key={`${tax.id}/name`}
              label="Name"
              field="name"
              taxonomy={tax}
            />
            <Property
              key={`${tax.id}/description`}
              label="Beschreibung"
              field="description"
              taxonomy={tax}
            />
            <StyledFormControl
              variant="standard"
              fullWidth
            >
              <InputLabel htmlFor="importedByArten">Importiert von</InputLabel>
              <Select
                key={`${tax.id}/importedBy`}
                value={tax.importedBy}
                onChange={onChangeImportedByArten}
                input={
                  <Input
                    id="importedByArten"
                    fullWidth
                  />
                }
                fullWidth
              >
                {allUsers.map((u) => (
                  <MenuItem
                    key={u.id}
                    value={u.id}
                  >
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl
              variant="standard"
              fullWidth
            >
              <InputLabel htmlFor="organizationIdArten">
                Zuständige Organisation
              </InputLabel>
              <Select
                key={`${tax.id}/organizationId`}
                value={tax.organizationId || ''}
                onChange={onChangeOrganizationArten}
                input={
                  <Input
                    id="organizationIdArten"
                    fullWidth
                  />
                }
              >
                {orgsUserIsTaxWriter.map((o) => (
                  <MenuItem
                    key={o.id}
                    value={o.id}
                  >
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <Property
              key={`${tax.id}/lastUpdated`}
              label="Zuletzt aktualisiert"
              field="lastUpdated"
              taxonomy={tax}
              disabled={true}
            />
            <Property
              key={`${tax.id}/termsOfUse`}
              label="Nutzungs-Bedingungen"
              field="termsOfUse"
              taxonomy={tax}
            />
          </>
        )}
        {editingLr && (
          <>
            <PropertyLr
              key={`${tax.id}/id`}
              label="ID"
              field="id"
              taxonomy={tax}
              disabled={true}
            />
            <PropertyLr
              key={`${tax.id}/name`}
              label="Name"
              field="name"
              taxonomy={tax}
            />
            <PropertyLr
              key={`${tax.id}/description`}
              label="Beschreibung"
              field="description"
              taxonomy={tax}
            />
            <StyledFormControl variant="standard">
              <InputLabel htmlFor="importedByLr">Importiert von</InputLabel>
              <Select
                key={`${tax.id}/importedBy`}
                value={tax.importedBy}
                onChange={onChangeImportedByLr}
                input={<Input id="importedByLr" />}
              >
                {allUsers.map((u) => (
                  <MenuItem
                    key={u.id}
                    value={u.id}
                  >
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl variant="standard">
              <InputLabel htmlFor="organizationIdLr">
                Zuständige Organisation
              </InputLabel>
              <Select
                key={`${tax.id}/organizationId`}
                value={tax.organizationId || ''}
                onChange={onChangeOrganizationLr}
                input={<Input id="organizationIdLr" />}
              >
                {orgsUserIsTaxWriter.map((o) => (
                  <MenuItem
                    key={o.id}
                    value={o.id}
                  >
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <PropertyLr
              key={`${tax.id}/lastUpdated`}
              label="Zuletzt aktualisiert"
              field="lastUpdated"
              taxonomy={tax}
              disabled={true}
            />
            <PropertyLr
              key={`${tax.id}/termsOfUse`}
              label="Nutzungs-Bedingungen"
              field="termsOfUse"
              taxonomy={tax}
            />
            <PropertyLr
              key={`${tax.id}/habitatLabel`}
              label="Einheit-Abkürzung"
              field="habitatLabel"
              taxonomy={tax}
            />
            <PropertyLr
              key={`${tax.id}/habitatComments`}
              label="Bemerkungen"
              field="habitatComments"
              taxonomy={tax}
            />
            <PropertyLr
              key={`${tax.id}/habitatNrFnsMin`}
              label="Einheit-Nrn FNS von"
              field="habitatNrFnsMin"
              taxonomy={tax}
              type="number"
            />
            <PropertyLr
              key={`${tax.id}/habitatNrFnsMax`}
              label="Einheit-Nrn FNS bis"
              field="habitatNrFnsMax"
              taxonomy={tax}
              type="number"
            />
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
})
