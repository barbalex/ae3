import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { withResizeDetector } from 'react-resize-detector'

import Comparator from './Comparator'
import Value from './Value'
import storeContext from '../../../../../../storeContext'

const Container = styled.div`
  display: flex;
  align-content: stretch;
  padding: 4px 16px;
  width: ${(props) => `${props['data-width']}%`};
`

const TaxField = ({
  taxname,
  pname,
  jsontype,
  columns,
  width,
  propertiesLength,
}) => {
  const store = useContext(storeContext)
  const { taxFilters } = store.export

  const exportTaxFilter = taxFilters.find(
    (x) => x.taxname === taxname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportTaxFilter

  const containerWidth = propertiesLength === 1 ? 100 : 100 / columns

  return (
    <Container data-width={containerWidth}>
      <Value
        key={`${taxname}/${pname}/${jsontype}/${value}`}
        taxname={taxname}
        pname={pname}
        value={value}
        jsontype={jsontype}
        comparator={comparator}
        width={width - 32}
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

export default withResizeDetector(observer(TaxField))
