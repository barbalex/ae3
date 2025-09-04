import { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import Comparator from './Comparator.jsx'
import Value from './Value.jsx'
import storeContext from '../../../../../../storeContext.js'
import { constants } from '../../../../../../modules/constants.js'

const Container = styled.div`
  display: flex;
  align-content: stretch;
  padding: 4px 16px;
  width: 100%;
  @container (min-width: ${2 * constants.export.properties.columnWidth}px) {
    width: calc(50cqw - 32px);
  }
  @container (min-width: ${3 * constants.export.properties.columnWidth}px) {
    width: calc(33cqw - 32px);
  }
  @container (min-width: ${4 * constants.export.properties.columnWidth}px) {
    width: calc(25cqw - 32px);
  }
`

const TaxField = ({ taxname, pname, jsontype }) => {
  const store = useContext(storeContext)
  const { taxFilters } = store.export

  const exportTaxFilter = taxFilters.find(
    (x) => x.taxname === taxname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportTaxFilter

  return (
    <Container>
      <Value
        key={`${taxname}/${pname}/${jsontype}/${value}`}
        taxname={taxname}
        pname={pname}
        value={value}
        jsontype={jsontype}
        comparator={comparator}
      />
      {value !== undefined && value !== null && (
        <Comparator
          taxname={taxname}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </Container>
  )
}

export default observer(TaxField)
