import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { booleanToJaNein } from '../../../../../modules/booleanToJaNein.js'
import storeContext from '../../../../../storeContext.js'

const FilterValueSpan = styled.span`
  background-color: #dadada;
  padding: 1px 8px;
  margin-left: 5px;
  border-radius: 3px;
`
const ResetSpan = styled.span`
  margin-left: 8px;
  font-weight: 100;
  font-style: italic;
  cursor: pointer;
  text-decoration: underline dotted rgba(0, 0, 0, 0.3);
`

const ExportTaxFilterListItem = ({ filter }) => {
  const store = useContext(storeContext)
  const { setTaxFilters } = store.export

  const { taxname, pname, comparator, value } = filter
  const onClick = useCallback(
    () =>
      setTaxFilters({
        taxname,
        pname,
        comparator: '',
        value: '',
      }),
    [pname, setTaxFilters, taxname],
  )

  return (
    <li>
      {`${taxname}: ${pname} ${comparator ? `${comparator}` : ''}`}
      <FilterValueSpan>
        {typeof value === 'boolean' ? booleanToJaNein(value) : value}
      </FilterValueSpan>
      <ResetSpan onClick={onClick}>zurücksetzen</ResetSpan>
    </li>
  )
}

export default observer(ExportTaxFilterListItem)
