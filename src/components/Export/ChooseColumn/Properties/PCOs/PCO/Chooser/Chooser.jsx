import React, { useCallback, useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

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

const PcoChooser = ({ pcname, pname, columns, propertiesLength }) => {
  const store = useContext(storeContext)
  const { pcoProperties, addPcoProperty, removePcoProperty } = store.export

  const onCheck = useCallback(
    (event, isChecked) => {
      if (isChecked) {
        return addPcoProperty({ pcname, pname })
      }
      removePcoProperty({ pcname, pname })
    },
    [addPcoProperty, pcname, pname, removePcoProperty],
  )

  const checked =
    pcoProperties.filter((x) => x.pcname === pcname && x.pname === pname)
      .length > 0

  const containerWidth = propertiesLength === 1 ? 100 : 100 / columns

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

export default observer(PcoChooser)