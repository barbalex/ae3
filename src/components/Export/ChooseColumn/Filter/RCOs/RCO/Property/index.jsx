import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import Comparator from './Comparator.jsx'
import Value from './Value.jsx'
import storeContext from '../../../../../../../storeContext.js'
import { constants } from '../../../../../../../modules/constants.js'

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
  > div {
    height: auto;
  }
`

const RcoField = ({ pcname, relationtype, pname, jsontype }) => {
  const store = useContext(storeContext)
  const { rcoFilters } = store.export

  const exportRcoFilter = rcoFilters.find(
    (x) =>
      x.pcname === pcname &&
      x.relationtype === relationtype &&
      x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportRcoFilter

  return (
    <Container>
      <Value
        key={`${pcname}/${pname}/${jsontype}/${value}`}
        pcname={pcname}
        relationtype={relationtype}
        pname={pname}
        value={value}
        comparator={comparator}
        jsontype={jsontype}
      />
      {value !== undefined && value !== null && (
        <Comparator
          pcname={pcname}
          relationtype={relationtype}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </Container>
  )
}

export default observer(RcoField)
