import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useAtom, useAtomValue } from 'jotai'

import { Taxonomies } from './Taxonomies.jsx'
import {
  exportTypeAtom,
  exportTaxonomiesAtom,
} from '../../../../../../jotaiStore/index.ts'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary.jsx'

import styles from './index.module.css'

const exportTypes = ['Arten', 'Lebensräume']
const exportTypeTAXToReadable = {
  ART: 'Arten',
  LEBENSRAUM: 'Lebensräume',
}

export const ExportType = ({ type }) => {
  const apolloClient = useApolloClient()
  const [exportType, setExportType] = useAtom(exportTypeAtom)
  const [exportTaxonomies, setExportTaxonomies] = useAtom(exportTaxonomiesAtom)

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
        setExportTaxonomies([...exportTaxonomies, taxonomyName])
      }
      // check if taxonomy(s) of other type was chosen
      // if so: uncheck
      const exportTaxonomiesWithoutOtherType = exportTaxonomies.filter(
        (t) => exportTypeTAXToReadable[t.type] === name,
      )
      if (exportTaxonomiesWithoutOtherType.length < exportTaxonomies.length) {
        setExportTaxonomies(exportTaxonomiesWithoutOtherType)
      }
    } else {
      setExportType(exportTypes.find((t) => t !== name))
      // uncheck all taxonomies of this type
      const taxonomiesToUncheck = (taxonomies ?? []).map((t) => t.taxonomyName)
      const remainingTaxonomies = exportTaxonomies.filter(
        (t) => !taxonomiesToUncheck.includes(t),
      )
      setExportTaxonomies(remainingTaxonomies)
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
          className={styles.label}
        />
        {exportType === type && <Taxonomies type={type} />}
      </div>
    </ErrorBoundary>
  )
}
