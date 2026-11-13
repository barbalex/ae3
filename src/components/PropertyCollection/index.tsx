import { Suspense } from 'react'
import type { MouseEvent, ChangeEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import { MdEdit as EditIcon, MdVisibility as ViewIcon } from 'react-icons/md'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import { format } from 'date-fns'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtom } from 'jotai'

import { Property } from './Property'
import { DateField } from '../shared/Date'
import { onBlurDo } from './onBlur'
import { apiFetch, apiCount } from '../../modules/api'
import {
  collectionWriterRoles,
  useUserIsWriter,
} from '../shared/useUserIsWriter'
import { PropertyReadOnly } from '../shared/PropertyReadOnly'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { editingPCsAtom } from '../../store'

import styles from './index.module.css'

export const PropertyCollection = () => {
  const { pcId } = useParams()
  const queryClient = useQueryClient()
  const [editingPCs, setEditingPCs] = useAtom(editingPCsAtom)

  const {
    data: dataPc,
    error: pcError,
    refetch,
  } = useQuery({
    queryKey: ['pc', pcId],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const [pcs, pcoCount, rcoCount] = await Promise.all([
        apiFetch(
          `/property_collection?id=eq.${pcId}&select=id,name,description,links,combining,organizationId:organization_id,lastUpdated:last_updated,termsOfUse:terms_of_use,importedBy:imported_by,organizationByOrganizationId:organization_id(id,name)`,
        ),
        apiCount(
          `/property_collection_object?property_collection_id=eq.${pcId}`,
        ),
        apiCount(`/relation?property_collection_id=eq.${pcId}`),
      ])
      const pC = pcs?.[0]
      if (!pC) return { pc: {}, pcoCount: 0, rcoCount: 0 }
      return { pc: pC, pcoCount, rcoCount }
    },
  })
  const pcData = dataPc

  const pC = pcData?.pc ?? {}
  const org = pC?.organizationByOrganizationId?.name ?? ''
  const {
    allUsers,
    orgsUserIsWriter: orgsUserIsPCWriter,
    userIsThisWriter: userIsThisPCWriter,
    error: allUsersError,
  } = useUserIsWriter(collectionWriterRoles, pC.organizationId)
  // the former graphql version also counted collections referencing this
  // one as their collection of origin; those counts were never refetched
  // after the postgrest migration, so the check only covers own rows
  const idIsReferenced = (pcData?.pcoCount ?? 0) > 0 || (pcData?.rcoCount ?? 0) > 0
  const importedBy = pC.importedBy
  const importedByUser = allUsers.find((u: any) => u.id === importedBy)

  const onClickStopEditing = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditingPCs(false)
  }
  const onClickStartEditing = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setEditingPCs(true)
  }
  const onChangeCombining = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) =>
    onBlurDo({
      field: 'combining',
      pC,
      value: isChecked,
      prevValue: pC.combining,
      queryClient,
      refetch,
    })
  const onChangeOrganization = (event: SelectChangeEvent) =>
    onBlurDo({
      field: 'organizationId',
      pC,
      value: event.target.value,
      prevValue: pC.organizationId,
      queryClient,
      refetch,
    })
  const onChangeImportedBy = (event: SelectChangeEvent) =>
    onBlurDo({
      field: 'importedBy',
      pC,
      value: event.target.value,
      prevValue: pC.importedBy,
      queryClient,
      refetch,
    })
  const onChangeLastUpdated = (event: { target: { value: string | null } }) =>
    onBlurDo({
      field: 'lastUpdated',
      pC,
      value: event.target.value,
      prevValue: pC.lastUpdated,
      queryClient,
      refetch,
    })

  if (pcError) {
    return (
      <div className={styles.container}>{`Fehler: ${pcError.message}`}</div>
    )
  }
  if (allUsersError) {
    return (
      <div
        className={styles.container}
      >{`Fehler: ${allUsersError.message}`}</div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Suspense
          fallback={<div className={styles.container}>Lade Daten...</div>}
        >
          {userIsThisPCWriter && editingPCs && (
            <IconButton
              className={styles.cardEditButton}
              aria-label="Daten anzeigen"
              title="Daten anzeigen"
              onClick={onClickStopEditing}
            >
              <ViewIcon />
            </IconButton>
          )}
          {userIsThisPCWriter && !editingPCs && (
            <IconButton
              className={styles.cardEditButton}
              aria-label="Daten bearbeiten"
              title="Daten bearbeiten"
              onClick={onClickStartEditing}
            >
              <EditIcon />
            </IconButton>
          )}
          {!editingPCs && (
            <>
              <PropertyReadOnly
                key="id"
                value={pC.id}
                label="id"
              />
              <PropertyReadOnly
                key="name"
                value={pC.name}
                label="Name"
              />
              <PropertyReadOnly
                key="description"
                value={pC.description}
                label="Beschreibung"
              />
              <PropertyReadOnly
                key="combining"
                value={
                  pC.combining !== undefined ?
                    pC.combining
                      .toString()
                      .replace('true', 'ja')
                      .replace('false', 'nein')
                  : ''
                }
                label="zusammenfassend"
              />
              <PropertyReadOnly
                key="lastUpdated"
                value={
                  pC.lastUpdated ?
                    format(new Date(pC.lastUpdated), 'dd.MM.yyyy')
                  : pC.lastUpdated
                }
                label="Zuletzt aktualisiert"
              />
              <PropertyReadOnly
                key="links"
                value={pC.links ? pC.links.join(', ') : ''}
                label="Links"
              />
              <PropertyReadOnly
                key="org"
                value={org}
                label="Zuständige Organisation"
              />
              <PropertyReadOnly
                key="importedBy"
                value={`${importedByUser?.name} (${importedByUser?.email})`}
                label="Importiert von"
              />
              <PropertyReadOnly
                key="termsOfUse"
                value={pC.termsOfUse}
                label="Nutzungs-Bedingungen"
              />
            </>
          )}
          {editingPCs && (
            <>
              <Property
                key={`${pC.id}/id`}
                label="ID"
                field="id"
                pC={pC}
                disabled={idIsReferenced}
                refetch={refetch}
              />
              <Property
                key={`${pC.id}/name`}
                label="Name"
                field="name"
                pC={pC}
                refetch={refetch}
                helperText={
                  <>
                    <span>
                      Ziel: der Leser sieht in der Liste der
                      Eigenschaften-Sammlungen auf einen Blick, worum es geht.
                    </span>
                    <br />
                    <br />
                    <span>
                      Der Name sollte ungefähr dem ersten Teil eines
                      Literaturzitats entsprechen. Aber möglichst kurz.
                    </span>
                    <br />
                    <span>{'Beispiel: "Artwert (2000)".'}</span>
                    <br />
                    <br />
                    <span>
                      Wurden die Informationen spezifisch für einen bestimmten
                      Kanton oder die ganze Schweiz erarbeitet?
                      <br />
                      Dann bitte das entsprechende Kürzel voranstellen.
                    </span>
                    <br />
                    <span>{'Beispiel: "ZH Artwert (2000)".'}</span>
                  </>
                }
              />
              <Property
                key={`${pC.id}/description`}
                label="Beschreibung"
                field="description"
                pC={pC}
                refetch={refetch}
                helperText={
                  <>
                    <span>
                      Ziel: der Leser kann urteilen, ob er diese Daten für
                      seinen Zweck benutzen kann.
                    </span>
                    <br />
                    <br />
                    <span>
                      Die Beschreibung sollte im ersten Teil etwa einem
                      klassischen Literaturzitat entsprechen.
                    </span>
                    <br />
                    <span>
                      {
                        'Beispiel: "Gigon A. et al. (1998): Blaue Listen der erfolgreich erhaltenen oder geförderten Tier- und Pflanzenarten der Roten Listen. Methodik und Anwendung in der nördlichen Schweiz. Veröff. Geobot. Inst. ETH, Stiftung Rübel, Zürich 129: 1-137 + 180 pp. Appendicesn".'
                      }
                    </span>
                    <br />
                    <br />
                    <span>
                      In einem zweiten Teil sollte beschrieben werden, welche
                      Informationen die Eigenschaftensammlung enthält.
                    </span>
                    <br />
                    <span>
                      {
                        'Beispiel: "Eigenschaften von 207 Tier- und 885 Pflanzenarten".'
                      }
                    </span>
                    <br />
                    <br />
                    <span>
                      Oft ist es zudem hilfreich zu wissen, für welchen Zweck
                      die Informationen zusammengestellt wurden.
                    </span>
                  </>
                }
              />
              <FormControl
                className={styles.formControl}
                variant="standard"
              >
                <FormControlLabel
                  className={styles.labelClass}
                  control={
                    <Checkbox
                      color="primary"
                      checked={pC.combining}
                      onChange={onChangeCombining}
                    />
                  }
                  label={'zusammenfassend'}
                />
                <FormHelperText>
                  <span>
                    Für eine zusammenfassende Eigenschaftensammlung importieren
                    Sie die Daten zwei mal:
                  </span>
                  <br />
                  <span>1. zuerst in die Ursprungs-Eigenschaftensammlung</span>
                  <br />
                  <span>
                    2. dann in die zusammenfassende. Bitte die
                    Ursprungs-Eigenschaftensammlung angeben
                  </span>
                  <br />
                  <span>
                    Mehr infos{' '}
                    <a
                      className={styles.a}
                      href="https://github.com/barbalex/ae3#zusammenfassende-eigenschaften-sammlungen"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      hier
                    </a>
                    .
                  </span>
                </FormHelperText>
              </FormControl>
              <DateField
                key={`${pC.id}/lastUpdated`}
                name="lastUpdated"
                label="Zuletzt aktualisiert"
                value={pC.lastUpdated}
                saveToDb={onChangeLastUpdated}
                helperText="Wann wurden die Eigenschaften dieser Sammlung zuletzt aktualisiert?"
              />
              <Property
                key={`${pC.id}/links`}
                label="Links"
                field="links"
                pC={pC}
                refetch={refetch}
                helperText={
                  <>
                    <span>
                      Z.B. zu Originalpublikation, erläuternde Webseite...
                    </span>
                    <br />
                    <br />
                    <span>
                      Mehrere Links können komma-getrennt erfasst werden.
                    </span>
                  </>
                }
              />
              <FormControl
                className={styles.formControl}
                variant="standard"
              >
                <InputLabel htmlFor="organizationIdArten">
                  Zuständige Organisation
                </InputLabel>
                <Select
                  key={`${pC.id}/organizationId`}
                  value={pC.organizationId || ''}
                  onChange={onChangeOrganization}
                  input={<Input id="organizationIdArten" />}
                >
                  {orgsUserIsPCWriter.map((o: any) => (
                    <MenuItem
                      key={o.id}
                      value={o.id}
                    >
                      {o.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                className={styles.formControl}
                variant="standard"
              >
                <InputLabel htmlFor="importedByArten">
                  Importiert von
                </InputLabel>
                <Select
                  key={`${pC.id}/importedBy`}
                  value={pC.importedBy}
                  onChange={onChangeImportedBy}
                  input={<Input id="importedByArten" />}
                >
                  {allUsers.map((u: any) => (
                    <MenuItem
                      key={u.id}
                      value={u.id}
                    >
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Property
                key={`${pC.id}/termsOfUse`}
                label="Nutzungs-Bedingungen"
                field="termsOfUse"
                pC={pC}
                refetch={refetch}
                helperText={
                  <>
                    <span>
                      Beispiel, wenn Fremddaten mit Einverständnis des Autors
                      importiert werden:
                    </span>
                    <br />
                    <span>
                      {
                        '"Importiert mit Einverständnis des Autors. Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich"'
                      }
                    </span>
                    <br />
                    <br />
                    <span>Beispiel, wenn eigene Daten importiert werden:</span>
                    <br />
                    <span>
                      {
                        '"Open Data: Die veröffentlichten Daten dürfen mit Hinweis auf die Quelle vervielfältigt, verbreitet und weiter zugänglich gemacht, angereichert und bearbeitet sowie kommerziell genutzt werden. Für die Richtigkeit, Genauigkeit, Zuverlässigkeit und Vollständigkeit der bezogenen, ebenso wie der daraus erzeugten Daten und anderer mit Hilfe dieser Daten hergestellten Produkte wird indessen keine Haftung übernommen.'
                      }
                    </span>
                  </>
                }
              />
            </>
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
