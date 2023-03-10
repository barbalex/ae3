import React, { useCallback, useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../storeContext'
import getConstants from '../../../../../../../modules/constants'
const constants = getConstants()

const Container = styled.div`
  width: 100%;
  @container (min-width: ${2 * constants.export.properties.columnWidth}px) {
    width: calc(50cqw);
  }
  @container (min-width: ${3 * constants.export.properties.columnWidth}px) {
    width: calc(33cqw);
  }
  @container (min-width: ${4 * constants.export.properties.columnWidth}px) {
    width: calc(25cqw);
  }
`
const Label = styled(FormControlLabel)`
  height: 30px;
  min-height: 30px;
  > span {
    font-weight: 500;
    line-height: 1em;
  }
`

const PcoChooser = ({ pcname, pname }) => {
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

  return (
    <Container>
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
