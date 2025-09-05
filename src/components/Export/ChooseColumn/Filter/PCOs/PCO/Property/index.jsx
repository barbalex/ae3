import { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { PcoComparator } from './Comparator.jsx'
import { PcoValue } from './Value.jsx'
import { PcoCheckbox } from './Checkbox.jsx'
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

export const PcoProperty = observer(({ pcname, pname, jsontype }) => {
  const store = useContext(storeContext)
  const { pcoFilters: pcoFiltersPassed } = store.export
  const pcoFilters = getSnapshot(pcoFiltersPassed)

  const pcoFilter = pcoFilters.find(
    (x) => x.pcname === pcname && x.pname === pname,
  ) || { comparator: null, value: null }
  const { comparator, value } = pcoFilter

  if (jsontype === 'Boolean') {
    return (
      <Container>
        <PcoCheckbox
          pcname={pcname}
          pname={pname}
          value={value}
        />
      </Container>
    )
  }

  return (
    <Container>
      <PcoValue
        key={`${pcname}/${pname}/${jsontype}/${value}`}
        pcname={pcname}
        pname={pname}
        value={value}
        comparator={comparator}
        jsontype={jsontype}
      />
      {value !== undefined && value !== null && value !== ' ' && (
        <PcoComparator
          pcname={pcname}
          pname={pname}
          comparator={comparator}
          value={value}
        />
      )}
    </Container>
  )
})
