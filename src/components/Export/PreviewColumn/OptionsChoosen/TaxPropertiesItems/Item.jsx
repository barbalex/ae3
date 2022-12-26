import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../storeContext'

const ResetSpan = styled.span`
  margin-left: 8px;
  font-weight: 100;
  font-style: italic;
  cursor: pointer;
  text-decoration: underline dotted rgba(0, 0, 0, 0.3);
`

const ExportTaxPropertiesListItem = ({ properties }) => {
  const store = useContext(storeContext)
  const { removeTaxProperty } = store.export

  const { taxname, pname } = properties
  const onClick = useCallback(
    () =>
      removeTaxProperty({
        taxname,
        pname,
      }),
    [pname, removeTaxProperty, taxname],
  )

  return (
    <li key={`${taxname}: ${pname}`}>
      {`${taxname}: ${pname}`}
      <ResetSpan onClick={onClick}>zurücksetzen</ResetSpan>
    </li>
  )
}

export default observer(ExportTaxPropertiesListItem)
