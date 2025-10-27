/**
 * TODO editing
 * if user is logged in and is orgAdmin or orgTaxonomyWriter
 * and object is not synonym
 * show editing symbol
 * if user clicks it, toggle store > editingTaxonomies
 * edit prop: see https://stackoverflow.com/a/35349699/712005
 */
import { useState, useContext, Suspense } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import {
  MdExpandMore as ExpandMoreIcon,
  MdEdit as EditIcon,
  MdVisibility as ViewIcon,
  MdForward as SynonymIcon,
  MdInfoOutline as InfoOutlineIcon,
  MdInfo as InfoIcon,
} from 'react-icons/md'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'

import { PropertyReadOnly } from '../../../shared/PropertyReadOnly.jsx'
import { PropertyReadOnlyStacked } from '../../../shared/PropertyReadOnlyStacked.jsx'
import { TaxonomyDescription } from '../../../shared/TaxonomyDescription.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Property } from './Property.jsx'
import LinkMenu from './LinkMenu.jsx'
import Properties from './Properties/index.jsx'
import { getUrlForObject } from '../../../../modules/getUrlForObject.js'
import { storeContext } from '../../../../storeContext.js'

const LoadingContainer = styled.div`
  margin: 10px;
`
const Container = styled.div`
  margin: 10px 0;
`
const StyledCard = styled(Card)`
  margin: 0;
  background-color: #fff3e0 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
  background-color: #ffcc80 !important;
`
const CardActionsButtons = styled.div`
  display: flex;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`
const StyledCardContent = styled(CardContent)`
  padding: 0 16px 0 16px !important;
  margin: 5px 0;
  column-width: 500px;
`
const StyledButton = styled(IconButton)`
  :hover {
    font-weight: 700;
    background-color: rgba(0, 0, 0, 0.12);
    text-decoration: none;
  }
`

const organizationUsersQuery = gql`
  query AllOrganizationUsersQuery {
    allOrganizationUsers {
      nodes {
        id
        nodeId
        organizationId
        userId
        role
        userByUserId {
          id
          name
        }
      }
    }
  }
`

export const TaxonomyObject = observer(({ objekt, showLink, stacked }) => {
  const queryClient = useQueryClient()
  const store = useContext(storeContext)
  const { editingTaxonomies, setEditingTaxonomies, login, scrollIntoView } =
    store

  const navigate = useNavigate()

  const {
    data: organizationUsersData,
    loading: organizationUsersLoading,
    error: organizationUsersError,
  } = useQuery(organizationUsersQuery)

  const [expanded, setExpanded] = useState(showLink ? false : true)
  const [taxExpanded, setTaxExpanded] = useState(false)

  const { username } = login
  const organizationUsers =
    organizationUsersData?.allOrganizationUsers?.nodes ?? []
  const editing = editingTaxonomies
  const userRoles = organizationUsers
    .filter((oU) => username === (oU?.userByUserId?.name ?? ''))
    .map((oU) => oU.role)
  const userIsTaxWriter =
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  const userMayWrite = userIsTaxWriter && !showLink
  const taxonomy = objekt?.taxonomyByTaxonomyId ?? {}
  let taxname = taxonomy?.name ?? '(Name fehlt)'
  // never pass null to object.entries!!!
  const properties = JSON.parse(objekt?.properties ?? '{}')
  if (properties['Artname vollständig']) {
    taxname = `${taxname}: ${properties['Artname vollständig']}`
  }
  let linkUrl
  let linkText
  if (showLink) {
    linkUrl = `/${getUrlForObject(objekt).join('/')}`
    linkText = taxonomy.type
      .replace('ART', 'Art')
      .replace('LEBENSRAUM', 'Lebensraum')
    linkText = `${linkText} öffnen`
  }

  const onClickActions = () => setExpanded(!expanded)
  const onClickLink = (e) => {
    // TODO:
    e.stopPropagation()
    navigate(linkUrl)
    setTimeout(() => scrollIntoView())
  }
  const onClickStopEditing = (e) => {
    e.stopPropagation()
    setEditingTaxonomies(false)
  }
  const onClickStartEditing = (e) => {
    e.stopPropagation()
    setEditingTaxonomies(true)
  }
  const onClickToggleTaxDescription = (e) => {
    e.stopPropagation()
    setTaxExpanded(!taxExpanded)
    setExpanded(true)
  }

  if (organizationUsersLoading) {
    return <Spinner />
  }
  if (organizationUsersError) {
    return (
      <LoadingContainer>{`Fehler: ${organizationUsersError.message}`}</LoadingContainer>
    )
  }

  return (
    <ErrorBoundary>
      <Container>
        <StyledCard>
          <StyledCardActions
            disableSpacing
            onClick={onClickActions}
          >
            <CardActionTitle>{taxname}</CardActionTitle>
            <CardActionsButtons>
              <LinkMenu objekt={objekt} />
              {showLink && (
                <StyledButton
                  aria-label={linkText}
                  title={linkText}
                  onClick={onClickLink}
                >
                  <SynonymIcon />
                </StyledButton>
              )}
              {userMayWrite && editing && expanded && (
                <StyledButton
                  aria-label="Daten anzeigen"
                  title="Daten anzeigen"
                  onClick={onClickStopEditing}
                >
                  <Icon>
                    <ViewIcon />
                  </Icon>
                </StyledButton>
              )}
              {userMayWrite && !editing && expanded && (
                <StyledButton
                  aria-label="Daten bearbeiten"
                  title="Daten bearbeiten"
                  onClick={onClickStartEditing}
                >
                  <Icon>
                    <EditIcon />
                  </Icon>
                </StyledButton>
              )}
              <IconButton
                data-expanded={taxExpanded}
                aria-expanded={taxExpanded}
                aria-label="über diese Taxonomie"
                title={
                  taxExpanded ?
                    'Taxonomie-Beschreibung schliessen'
                  : 'Taxonomie-Beschreibung öffnen'
                }
                onClick={onClickToggleTaxDescription}
                size="large"
              >
                <Icon>
                  {!taxExpanded && <InfoOutlineIcon />}
                  {taxExpanded && <InfoIcon />}
                </Icon>
              </IconButton>
              <CardActionIconButton
                data-expanded={expanded}
                aria-expanded={expanded}
                aria-label="Show more"
                title={expanded ? 'Taxonomie schliessen' : 'Taxonomie öffnen'}
              >
                <Icon>
                  <ExpandMoreIcon />
                </Icon>
              </CardActionIconButton>
            </CardActionsButtons>
          </StyledCardActions>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
          >
            <Collapse
              in={taxExpanded}
              timeout="auto"
              unmountOnExit
            >
              <TaxonomyDescription taxonomy={taxonomy} />
            </Collapse>
            <StyledCardContent>
              {editing ?
                <>
                  <Property
                    key={`${objekt?.id}/id`}
                    label="ID"
                    field="id"
                    objekt={objekt}
                    disabled={true}
                  />
                  <Property
                    key={`${objekt?.id}/name`}
                    label="Name"
                    field="name"
                    objekt={objekt}
                  />
                </>
              : stacked ?
                <>
                  <PropertyReadOnlyStacked
                    key={`${objekt?.id}/id`}
                    value={objekt?.id}
                    label="ID"
                  />
                  <PropertyReadOnlyStacked
                    key={`${objekt?.id}/name`}
                    value={objekt?.name}
                    label="Name"
                  />
                </>
              : <>
                  <PropertyReadOnly
                    key={`${objekt?.id}/id`}
                    value={objekt?.id}
                    label="ID"
                  />
                  <PropertyReadOnly
                    key={`${objekt?.id}/name`}
                    value={objekt?.name}
                    label="Name"
                  />
                </>
              }
              <Properties
                id={objekt?.id}
                properties={properties}
                stacked={stacked}
              />
            </StyledCardContent>
          </Collapse>
        </StyledCard>
      </Container>
    </ErrorBoundary>
  )
})
