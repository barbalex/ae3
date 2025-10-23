import { useContext } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../../../../storeContext.js'
import { constants } from '../../../../../../modules/constants.js'

const Container = styled.div`
  width: 100%;
  @container (min-width: ${2 * constants.export.properties.columnWidth}px) {
    width: 50cqw;
  }
  @container (min-width: ${3 * constants.export.properties.columnWidth}px) {
    width: 33cqw;
  }
  @container (min-width: ${4 * constants.export.properties.columnWidth}px) {
    width: 25cqw;
  }
`
const Count = styled.span`
  font-size: xx-small;
`
const Label = styled(FormControlLabel)`
  height: 30px;
  min-height: 30px;
  > span {
    font-weight: 500;
    line-height: 1em;
  }
`

export const Chooser = observer(({ taxname, pname, count }) => {
  const store = useContext(storeContext)
  const { taxProperties, addTaxProperty, removeTaxProperty } = store.export

  const onCheck = (event, isChecked) => {
    if (isChecked) {
      return addTaxProperty({ taxname, pname })
    }
    return removeTaxProperty({ taxname, pname })
  }

  const checked =
    taxProperties.filter((x) => /*x.taxname === taxname && */ x.pname === pname)
      .length > 0

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
        label={
          <div>
            {pname} <Count title="Anzahl Objekte">{`(${count} Objekte)`}</Count>
          </div>
        }
      />
    </Container>
  )
})
