/**
 * TODO editing
 * if user is logged in and is orgAdmin or orgTaxonomyWriter
 * and object is not synonym
 * show editing symbol
 * if user clicks it, toggle store > editingTaxonomies
 * edit prop: see https://stackoverflow.com/a/35349699/712005
 */
import { useState, Suspense } from 'react'
import type { MouseEvent } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useSetAtom, useAtomValue, useAtom } from 'jotai'

import { parseProperties } from '../../../../modules/parseProperties'
import { apiFetch } from '../../../../modules/api'

import { PropertyReadOnly } from '../../../shared/PropertyReadOnly'
import { PropertyReadOnlyStacked } from '../../../shared/PropertyReadOnlyStacked'
import { TaxonomyDescription } from '../../../shared/TaxonomyDescription'
import { Spinner } from '../../../shared/Spinner'
import { ErrorBoundary } from '../../../shared/ErrorBoundary'
import { Property } from './Property'
import LinkMenu from './LinkMenu'
import Properties from './Properties'
import { getUrlForObject } from '../../../../modules/getUrlForObject'
import {
  scrollIntoViewAtom,
  loginUsernameAtom,
  stackedAtom,
  editingTaxonomiesAtom,
} from '../../../../store'

import styles from './index.module.css'

type TaxonomyObjectProps = {
  objekt?: any
  showLink?: boolean
  refetch?: () => void
}

export const TaxonomyObject = ({ objekt, showLink, refetch }: TaxonomyObjectProps) => {
  const [editingTaxonomies, setEditingTaxonomies] = useAtom(
    editingTaxonomiesAtom,
  )
  const stacked = useAtomValue(stackedAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)
  const username = useAtomValue(loginUsernameAtom)

  const navigate = useNavigate()

  const { data, error } = useQuery({
    queryKey: ['organizationUsers'],
    queryFn: () =>
      apiFetch(
        '/organization_user?select=id,organizationId:organization_id,userId:user_id,role,userByUserId:user_id(id,name)',
      ),
  })

  const [expanded, setExpanded] = useState(showLink ? false : true)
  const [taxExpanded, setTaxExpanded] = useState(false)

  const organizationUsers = data ?? []
  const editing = editingTaxonomies
  const userRoles = organizationUsers
    .filter((oU: any) => username === (oU?.userByUserId?.name ?? ''))
    .map((oU: any) => oU.role)
  const userIsTaxWriter =
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  const userMayWrite = userIsTaxWriter && !showLink
  const taxonomy = objekt?.taxonomyByTaxonomyId ?? {}
  let taxname = taxonomy?.name ?? '(Name fehlt)'
  // never pass null to object.entries!!!
  const properties = parseProperties(objekt?.properties)
  if (properties['Artname vollständig']) {
    taxname = `${taxname}: ${properties['Artname vollständig']}`
  }
  let linkUrl: string | undefined
  let linkText
  if (showLink) {
    linkUrl = `/${getUrlForObject(objekt).join('/')}`
    linkText = taxonomy.type
      .replace('ART', 'Art')
      .replace('LEBENSRAUM', 'Lebensraum')
    linkText = `${linkText} öffnen`
  }

  const onClickActions = () => setExpanded(!expanded)
  const onClickLink = (e: MouseEvent<HTMLButtonElement>) => {
    // TODO:
    e.stopPropagation()
    navigate(linkUrl!)
    setTimeout(() => scrollIntoView())
  }
  const onClickStopEditing = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEditingTaxonomies(false)
  }
  const onClickStartEditing = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setEditingTaxonomies(true)
  }
  const onClickToggleTaxDescription = (e: MouseEvent<HTMLButtonElement>) => {
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
}
