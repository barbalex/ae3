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
import {
  MdExpandMore as ExpandMoreIcon,
  MdEdit as EditIcon,
  MdVisibility as ViewIcon,
  MdForward as SynonymIcon,
  MdInfoOutline as InfoOutlineIcon,
  MdInfo as InfoIcon,
} from 'react-icons/md'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import { useSetAtom, useAtomValue } from 'jotai'

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
import {
  scrollIntoViewAtom,
  loginUsernameAtom,
} from '../../../../jotaiStore/index.ts'

import styles from './index.module.css'

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

export const TaxonomyObject = observer(({ objekt, showLink, refetch }) => {
  const queryClient = useQueryClient()
  const store = useContext(storeContext)
  const { editingTaxonomies, setEditingTaxonomies, stacked } = store
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)
  const username = useAtomValue(loginUsernameAtom)
  const apolloClient = useApolloClient()

  const navigate = useNavigate()

  const { data, error } = useQuery({
    queryKey: ['organizationUsers'],
    queryFn: () =>
      apolloClient.query({
        query: organizationUsersQuery,
      }),
  })

  const [expanded, setExpanded] = useState(showLink ? false : true)
  const [taxExpanded, setTaxExpanded] = useState(false)

  const organizationUsers = data?.data?.allOrganizationUsers?.nodes ?? []
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

  if (error) {
    return (
      <div className={styles.errorContainer}>{`Fehler: ${error.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.container}>
          <Card className={styles.card}>
            <CardActions
              disableSpacing
              onClick={onClickActions}
              className={styles.cardActions}
            >
              <div className={styles.cardActionTitle}>{taxname}</div>
              <div className={styles.cardActionsButtons}>
                <LinkMenu objekt={objekt} />
                {showLink && (
                  <IconButton
                    aria-label={linkText}
                    title={linkText}
                    onClick={onClickLink}
                  >
                    <SynonymIcon />
                  </IconButton>
                )}
                {userMayWrite && editing && expanded && (
                  <IconButton
                    aria-label="Daten anzeigen"
                    title="Daten anzeigen"
                    onClick={onClickStopEditing}
                  >
                    <ViewIcon />
                  </IconButton>
                )}
                {userMayWrite && !editing && expanded && (
                  <IconButton
                    aria-label="Daten bearbeiten"
                    title="Daten bearbeiten"
                    onClick={onClickStartEditing}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
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
                  {!taxExpanded && <InfoOutlineIcon />}
                  {taxExpanded && <InfoIcon />}
                </IconButton>
                <IconButton
                  aria-expanded={expanded}
                  aria-label="Show more"
                  title={expanded ? 'Taxonomie schliessen' : 'Taxonomie öffnen'}
                  style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
            </CardActions>
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
              <CardContent className={styles.cardContent}>
                {editing ?
                  <>
                    <Property
                      key={`${objekt?.id}/id`}
                      label="ID"
                      field="id"
                      objekt={objekt}
                      disabled={true}
                      refetch={refetch}
                    />
                    <Property
                      key={`${objekt?.id}/name`}
                      label="Name"
                      field="name"
                      objekt={objekt}
                      refetch={refetch}
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
                  refetch={refetch}
                />
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
})
