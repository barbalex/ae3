import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { withResizeDetector } from 'react-resize-detector'

import Comparator from './Comparator'
import Value from './Value'
import storeContext from '../../../../../../../storeContext'

const Container = styled.div`
  display: flex;
  align-content: stretch;
  padding: 4px 16px;
  width: ${(props) => `${props['data-width']}%`};
  > div {
    height: auto;
  }
`

const RcoField = ({
  pcname,
  relationtype,
  pname,
  jsontype,
  width,
  columns,
  propertiesLength,
}) => {
  const store = useContext(storeContext)
  const { rcoFilters } = store.export

  const exportRcoFilter = rcoFilters.find(
    (x) =>
      x.pcname === pcname &&
      x.relationtype === relationtype &&
      x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = exportRcoFilter

  const containerWidth = propertiesLength === 1 ? 100 : 100 / columns

  return (
    <Container data-width={containerWidth}>
      <Value
        key={`${pcname}/${pname}/${jsontype}/${value}`}
        pcname={pcname}
        relationtype={relationtype}
        pname={pname}
        value={value}
        comparator={comparator}
        jsontype={jsontype}
        width={width - 32}
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

export default withResizeDetector(observer(RcoField))
