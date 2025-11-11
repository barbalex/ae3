import { useContext } from 'react'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { TaxFilterItems } from './TaxFilterItems/index.jsx'
import { PcoFilterItems } from './PcoFilterItems/index.jsx'
import { RcoFilterItems } from './RcoFilterItems/index.jsx'
import { TaxPropertiesItems } from './TaxPropertiesItems/index.jsx'
import { PcoPropertiesItems } from './PcoPropertiesItems/index.jsx'
import { RcoPropertiesItems } from './RcoPropertiesItems/index.jsx'
import { storeContext } from '../../../../storeContext.js'

import {
  container,
  title,
  reset,
  button,
  hinweise,
  optionen,
} from './index.module.css'

export const OptionsChoosen = observer(() => {
  const store = useContext(storeContext)
  const {
    setType,
    type: exportType,
    setTaxonomies,
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
    resetTaxProperties,
    taxProperties: taxPropertiesPassed,
  } = store.export
  const pcoFilters = getSnapshot(pcoFiltersPassed)
  const rcoFilters = getSnapshot(rcoFiltersPassed)
  const taxFilters = getSnapshot(taxFiltersPassed)
  const rcoProperties = getSnapshot(rcoPropertiesPassed)
  const pcoProperties = getSnapshot(pcoPropertiesPassed)
  const taxProperties = getSnapshot(taxPropertiesPassed)
  const exportTaxonomies = store.export.taxonomies.toJSON()

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
    setType(null)
    setTaxonomies([])
    resetPcoProperties()
    resetRcoProperties()
    resetTaxProperties()
    resetTaxFilters()
    resetPcoFilters()
    resetRcoFilters()
    setWithSynonymData(true)
  }

  const onClickResetType = () => {
    setType()
    setTaxonomies([])
  }

  const onClickResetTaxonomies = () => setTaxonomies([])

  const onClickResetExportWithSynonymData = () => setWithSynonymData(true)

  if (noDataChoosen) return null

  return (
    <div className={container}>
      <div
        className={title}
        title="Gewählte Optionen"
      >
        Gewählte Optionen
      </div>
      <ul className={optionen}>
        <li>
          {`Typ: ${!exportType ? ' keiner' : exportType}`}
          {!!exportType && (
            <span
              className={reset}
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
              className={reset}
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
              className={reset}
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
        className={title}
        title="Hinweise"
      >
        Hinweise
      </div>
      <ul className={hinweise}>
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
        className={button}
      >
        alle Optionen zurücksetzen
      </Button>
    </div>
  )
})
