import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { storeContext } from '../../../../../../storeContext.js'
import { exportTypeAtom } from '../../../../../../jotaiStore/index.ts'
import styles from './Taxonomies.module.css'

export const Taxonomies = observer(({ type }) => {
  const store = useContext(storeContext)
  const setExportType = useSetAtom(exportTypeAtom)
  const { setTaxonomies } = store.export
  const exportTaxonomies = store.export.taxonomies.toJSON()
  const apolloClient = useApolloClient()

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
  const { data, error } = useQuery({
    queryKey: ['allTaxonomies', type],
    queryFn: () =>
      apolloClient.query({
        query: taxonomiesQuery,
      }),
  })
  const taxonomies = data?.data?.allTaxonomies?.nodes

  const onCheckTaxonomy = async (event, isChecked) => {
    const { name } = event.target
    let taxonomies
    if (isChecked) {
      taxonomies = [...exportTaxonomies, name]
      setTaxonomies(taxonomies)
    } else {
      taxonomies = exportTaxonomies.filter((c) => c !== name)
      setTaxonomies(taxonomies)
      if ((taxonomies ?? []).length === 0) {
        // this was the only taxonomy in this type
        // it makes sense to also uncheck the type
        setExportType(null)
      }
    }
  }

  if (error) return `Fehler beim Laden der Taxonomien: ${error.message}`

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {(taxonomies ?? []).length === 1 ? 'Taxonomie:' : 'Taxonomien:'}
      </div>
      <FormGroup>
        {(taxonomies ?? []).map((tax) => (
          <FormControlLabel
            key={tax.name}
            control={
              <Checkbox
                color="primary"
                name={tax.name}
                checked={exportTaxonomies.includes(tax.name)}
                onChange={onCheckTaxonomy}
              />
            }
            label={tax.name}
            className={styles.label}
          />
        ))}
      </FormGroup>
    </div>
  )
})
