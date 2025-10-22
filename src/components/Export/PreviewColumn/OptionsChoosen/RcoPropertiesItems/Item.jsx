import { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../storeContext.js'

const ResetSpan = styled.span`
  margin-left: 8px;
  font-weight: 100;
  font-style: italic;
  cursor: pointer;
  text-decoration: underline dotted rgba(0, 0, 0, 0.3);
`

const ExportRcoPropertiesListItem = observer(({ properties }) => {
  const { pcname, relationtype, pname } = properties
  const store = useContext(storeContext)
  const { removeRcoProperty } = store.export

  const onClick = () =>
    removeRcoProperty({
      pcname,
      relationtype,
      pname,
    })

  return (
    <li>
      {`${pcname} - ${relationtype}: ${pname}`}
      <ResetSpan onClick={onClick}>zurücksetzen</ResetSpan>
    </li>
  )
})

export default ExportRcoPropertiesListItem
