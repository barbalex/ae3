import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../storeContext.js'

const Container = styled.div`
  margin-bottom: 16px;
`
const Label = styled(FormControlLabel)`
  height: 30px;
  min-height: 30px;
  > span {
    font-weight: 500;
    line-height: 1em;
  }
`

export const AllChooser = observer(({ properties }) => {
  const store = useContext(storeContext)
  const { taxProperties, addTaxProperty, removeTaxProperty } = store.export

  const onCheck = async (event, isChecked) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const p of properties) {
      const taxname = p.taxname ? p.taxname : p.taxonomyName
      const pname = p.propertyName
      if (isChecked) {
        addTaxProperty({ taxname, pname })
      } else {
        removeTaxProperty({ taxname, pname })
      }
    }
  }

  const checkedArray = properties.map((p) => {
    const taxname = p.taxname ? p.taxname : p.taxonomyName
    return (
      taxProperties.filter(
        (x) => x.taxname === taxname && x.pname === p.propertyName,
      ).length > 0
    )
  })
  const checked = checkedArray.length > 0 && !checkedArray.includes(false)

  return (
    <Container>
      <Label
        control={
          <Checkbox
            color="primary"
            checked={checked}
            onChange={onCheck}
          />
        }
        label="alle"
      />
    </Container>
  )
})
