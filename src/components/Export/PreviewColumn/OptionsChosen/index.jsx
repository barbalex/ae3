import { useContext } from 'react'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useAtom, useSetAtom, useAtomValue } from 'jotai'

import { TaxFilterItems } from './TaxFilterItems/index.jsx'
import { PcoFilterItems } from './PcoFilterItems/index.jsx'
import { RcoFilterItems } from './RcoFilterItems/index.jsx'
import { TaxPropertiesItems } from './TaxPropertiesItems/index.jsx'
import { PcoPropertiesItems } from './PcoPropertiesItems/index.jsx'
import { RcoPropertiesItems } from './RcoPropertiesItems/index.jsx'
import { storeContext } from '../../../../storeContext.js'
import {
  exportTypeAtom,
  exportTaxonomiesAtom,
  exportTaxPropertiesAtom,
} from '../../../../jotaiStore/index.ts'

import styles from './index.module.css'

export const OptionsChosen = observer(() => {
  const store = useContext(storeContext)
  const [exportType, setExportType] = useAtom(exportTypeAtom)
  const [exportTaxonomies, setExportTaxonomies] = useAtom(exportTaxonomiesAtom)
  const [taxProperties, setTaxProperties] = useAtom(exportTaxPropertiesAtom)
  const {
    withSynonymData,
    setWithSynonymData,
    pcoFilters: pcoFiltersPassed,
    rcoFilters: rcoFiltersPassed,
    taxFilters: taxFiltersPassed,
    resetPcoFilters,
    resetRcoFilters,
    resetTaxFilters,
    resetRcoProperties,
    rcoProperties: rcoPropertiesPassed,
    resetPcoProperties,
    pcoProperties: pcoPropertiesPassed,
  } = store.export
  const pcoFilters = getSnapshot(pcoFiltersPassed)
  const rcoFilters = getSnapshot(rcoFiltersPassed)
  const taxFilters = getSnapshot(taxFiltersPassed)
  const rcoProperties = getSnapshot(rcoPropertiesPassed)
  const pcoProperties = getSnapshot(pcoPropertiesPassed)

  const noDataChoosen =
    [
      ...exportTaxonomies,
      ...taxProperties,
      ...pcoProperties,
      ...rcoProperties,
      ...taxFilters,
      ...pcoFilters,
      ...rcoFilters,
    ].length === 0

  const onClickResetAll = () => {
    setExportType(null)
    setExportTaxonomies([])
    resetPcoProperties()
    resetRcoProperties()
    setTaxProperties([])
    resetTaxFilters()
    resetPcoFilters()
    resetRcoFilters()
    setWithSynonymData(true)
  }

  const onClickResetType = () => {
    setExportType(null)
    setExportTaxonomies([])
  }

  const onClickResetTaxonomies = () => setExportTaxonomies([])

  const onClickResetExportWithSynonymData = () => setWithSynonymData(true)

  if (noDataChoosen) return null

  return (
    <div className={styles.container}>
      <div
        className={styles.title}
        title="Gewählte Optionen"
      >
        Gewählte Optionen
      </div>
      <ul className={styles.optionen}>
        <li>
          {`Typ: ${!exportType ? ' keiner' : exportType}`}
          {!!exportType && (
            <span
              className={styles.reset}
              onClick={onClickResetType}
            >
              zurücksetzen
            </span>
          )}
        </li>
        <li>
          {`Taxonomie${exportTaxonomies.length > 1 ? 'n' : ''}: ${
            exportTaxonomies.length === 0 ?
              ' keine'
            : exportTaxonomies.join(', ')
          }`}
          {exportTaxonomies.length > 0 && (
            <span
              className={styles.reset}
              onClick={onClickResetTaxonomies}
            >
              zurücksetzen
            </span>
          )}
        </li>
        <li>
          {`${
            withSynonymData ?
              'Informationen von Synonymen mit exportieren'
            : 'Ohne Informationen von Synonymen'
          }`}
          {!withSynonymData && (
            <span
              className={styles.reset}
              onClick={onClickResetExportWithSynonymData}
            >
              zurücksetzen
            </span>
          )}
        </li>
        <li>
          {`Filter:${
            [...taxFilters, ...pcoFilters, ...rcoFilters].length === 0 ?
              ' keine'
            : ''
          }`}
          <ul>
            <TaxFilterItems taxFilters={taxFilters} />
            <PcoFilterItems pcoFilters={pcoFilters} />
            <RcoFilterItems rcoFilters={rcoFilters} />
          </ul>
        </li>
        <li>
          {`Eigenschaften:${
            (
              [...taxProperties, ...pcoProperties, ...rcoProperties].length ===
              0
            ) ?
              ' keine (die id kommt immer mit)'
            : ' (die id kommt immer mit)'
          }`}
          <ul>
            <TaxPropertiesItems taxProperties={taxProperties} />
            <PcoPropertiesItems pcoProperties={pcoProperties} />
            <RcoPropertiesItems rcoProperties={rcoProperties} />
          </ul>
        </li>
      </ul>
      <div
        className={styles.title}
        title="Hinweise"
      >
        Hinweise
      </div>
      <ul className={styles.hinweise}>
        <li>
          Spaltentitel werden aus den Namen der Taxonomie, Eigenschaften- oder
          Beziehungssammlung und dem jeweiligen Feldnamen zusammengesetzt. Bei
          Beziehungssammlungen muss auch noch der Typ der Beziehung
          berücksichtigt werden.
        </li>
        <li>
          Die Länge von Spaltentiteln ist auf 64 Zeichen begrenzt. Daher muss
          die Anwendung zu lange Namen kürzen. Gekürzte Namen können schwer
          verständlich sein.
        </li>
        <li>
          In seltenen Fällen kann das sogar dazu führen, dass der Export
          scheitert (wenn zwei gekürzte Namen identisch sind)
        </li>
        {rcoProperties.length > 0 && (
          <li>
            Eine Art oder ein Lebensraum kann Beziehungen zu <b>mehreren</b>{' '}
            anderen Arten oder Lebensräumen haben. Beziehungspartner und
            Eigenschaften mehrerer Beziehungen werden daher mit | getrennt in
            einer Zelle gesammelt.
          </li>
        )}
      </ul>
      <Button
        onClick={onClickResetAll}
        variant="outlined"
        color="inherit"
        className={styles.button}
      >
        alle Optionen zurücksetzen
      </Button>
    </div>
  )
})
