import { useContext } from 'react'
import styled from '@emotion/styled'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

import storeContext from '../../../../../../storeContext.js'

const TaxContainer = styled.div`
  margin-left: 39px;
  margin-bottom: 10px;
  margin-top: 3px;
`
const TaxTitle = styled.div`
  margin-left: -5px;
`
const TaxonomyLabel = styled(FormControlLabel)`
  height: 33px;
  min-height: 33px;
  margin-left: -20px !important;
  > span {
    font-weight: 500;
    line-height: 1em;
  }
`

export const Taxonomies = observer(({ type }) => {
  const store = useContext(storeContext)
  const { setType, setTaxonomies } = store.export
  const exportTaxonomies = store.export.taxonomies.toJSON()

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
  const { data, error } = useQuery(taxonomiesQuery)
  const taxonomies = data?.allTaxonomies?.nodes

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
        setType(null)
      }
    }
  }

  if (error) return `Fehler beim Laden der Taxonomien: ${error.message}`

  return (
    <TaxContainer>
      <TaxTitle>
        {(taxonomies ?? []).length === 1 ? 'Taxonomie:' : 'Taxonomien:'}
      </TaxTitle>
      <FormGroup>
        {(taxonomies ?? []).map((tax) => (
          <TaxonomyLabel
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
          />
        ))}
      </FormGroup>
    </TaxContainer>
  )
})
