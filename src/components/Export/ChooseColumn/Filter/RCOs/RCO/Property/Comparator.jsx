import { useContext } from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { ComparatorSelect } from '../../../ComparatorSelect.jsx'
import storeContext from '../../../../../../../storeContext.js'

const Container = styled.div`
  display: flex;
  flew-wrap: wrap;
  flex-basis: 150px;
  flex-shrink: 0;
  flex-grow: 1;
`
const StyledFormControl = styled(FormControl)`
  margin: 0 !important;
  width: 100%;
  min-width: 120px;
  > label {
    padding-left: 8px;
  }
`

const RcoComparator = ({ pcname, relationtype, pname, value, comparator }) => {
  const store = useContext(storeContext)
  const { setRcoFilters } = store.export

  const onChange = (event) =>
    setRcoFilters({
      pcname,
      relationtype,
      pname,
      comparator: event.target.value,
      value,
    })

  return (
    <Container>
      <StyledFormControl variant="standard">
        <InputLabel htmlFor="v-op">Vergleichs-Operator</InputLabel>
        <ComparatorSelect
          comparator={comparator}
          onChange={onChange}
        />
      </StyledFormControl>
    </Container>
  )
}

export default observer(RcoComparator)
