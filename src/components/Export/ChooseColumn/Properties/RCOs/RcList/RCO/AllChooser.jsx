import React, { useCallback, useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../storeContext'

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

const AllRcoChooser = ({ properties, relationtype }) => {
  const store = useContext(storeContext)
  const { rcoProperties, addRcoProperty, removeRcoProperty } = store.export

  const onCheck = useCallback(
    (event, isChecked) => {
      if (isChecked) {
        return properties.forEach(({ pcname, property }) =>
          addRcoProperty({ pcname, relationtype, pname: property }),
        )
      }
      removeRcoProperty({
        pcname: properties[0].pcname,
        relationtype,
        pname: properties[0].property,
      })
      properties.forEach(({ pcname, property }) => {
        removeRcoProperty({ pcname, relationtype, pname: property })
      })
    },
    [addRcoProperty, properties, relationtype, removeRcoProperty],
  )

  const checkedArray = properties.map(
    (p) =>
      rcoProperties.filter(
        (x) =>
          x.pcname === p.pcname &&
          x.relationtype === relationtype &&
          x.pname === p.property,
      ).length > 0,
  )
  const checked = checkedArray.length > 0 && !checkedArray.includes(false)

  return (
    <Container>
      <Label
        control={
          <Checkbox color="primary" checked={checked} onChange={onCheck} />
        }
        label="alle"
      />
    </Container>
  )
}

export default observer(AllRcoChooser)
