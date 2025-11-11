import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { Taxonomies } from './Taxonomies.jsx'
import { storeContext } from '../../../../../../storeContext.js'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

import { label } from './index.module.css'

const exportTypes = ['Arten', 'Lebensräume']
const exportTypeTAXToReadable = {
  ART: 'Arten',
  LEBENSRAUM: 'Lebensräume',
}

export const ExportType = observer(({ type }) => {
  const apolloClient = useApolloClient()
  const store = useContext(storeContext)
  const {
    type: exportType,
    setType: setExportType,
    setTaxonomies,
  } = store.export
  const exportTaxonomies = store.export.taxonomies.toJSON()

  const onCheckType = async (event, isChecked) => {
    const { name } = event.target
    const taxonomiesQuery = gql`
        query AllTaxonomiesQuery {
          allTaxonomies(filter: {type: {equalTo: ${
            type === 'Arten' ? 'ART' : 'LEBENSRAUM'
          }}}, orderBy: NAME_ASC) {
            nodes {
              id
              name
              type
            }
          }
        }
      `
    const { data } = apolloClient.query({ query: taxonomiesQuery })
    const taxonomies = data?.allTaxonomies?.nodes
    if (isChecked) {
      setExportType(name)
      // check if only one Taxonomy exists
      // if so, check it
      if ((taxonomies ?? []).length === 1) {
        const taxonomyName = taxonomies[0]?.taxonomyName
        setTaxonomies([...exportTaxonomies, taxonomyName])
      }
      // check if taxonomy(s) of other type was chosen
      // if so: uncheck
      const exportTaxonomiesWithoutOtherType = exportTaxonomies.filter(
        (t) => exportTypeTAXToReadable[t.type] === name,
      )
      if (exportTaxonomiesWithoutOtherType.length < exportTaxonomies.length) {
        setTaxonomies(exportTaxonomiesWithoutOtherType)
      }
    } else {
      setExportType(exportTypes.find((t) => t !== name))
      // uncheck all taxonomies of this type
      const taxonomiesToUncheck = (taxonomies ?? []).map((t) => t.taxonomyName)
      const remainingTaxonomies = exportTaxonomies.filter(
        (t) => !taxonomiesToUncheck.includes(t),
      )
      setTaxonomies(remainingTaxonomies)
    }
  }

  return (
    <ErrorBoundary>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name={type}
              checked={exportType === type}
              onChange={onCheckType}
            />
          }
          label={type}
          className={label}
        />
        {exportType === type && <Taxonomies type={type} />}
      </div>
    </ErrorBoundary>
  )
})
