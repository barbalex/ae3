import React, { useCallback, useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../../../../../../../storeContext'

const Container = styled.div`
  width: ${(props) => `${props['data-width']}%`};
`
const Label = styled(FormControlLabel)`
  height: 30px;
  min-height: 30px;
  > span {
    font-weight: 500;
    line-height: 1em;
  }
`

const RcoChooser = ({
  pcname,
  relationtype,
  pname,
  propertiesLength,
}) => {
  const store = useContext(storeContext)
  const { rcoProperties, addRcoProperty, removeRcoProperty } = store.export

  const onCheck = useCallback(
    (event, isChecked) => {
      if (isChecked) {
        return addRcoProperty({ pcname, relationtype, pname })
      }
      removeRcoProperty({ pcname, relationtype, pname })
    },
    [removeRcoProperty, pcname, relationtype, pname, addRcoProperty],
  )

  const checked =
    rcoProperties.filter(
      (x) =>
        x.pcname === pcname &&
        x.relationtype === relationtype &&
        x.pname === pname,
    ).length > 0

  const containerWidth = propertiesLength === 1 ? 100 : 100 / propertiesLength

  return (
    <Container data-width={containerWidth}>
      <Label
        control={
          <Checkbox color="primary" checked={checked} onChange={onCheck} />
        }
        label={<div>{pname}</div>}
      />
    </Container>
  )
}

export default observer(RcoChooser)
