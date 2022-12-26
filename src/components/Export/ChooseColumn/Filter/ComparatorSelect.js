import React from 'react'
import Input from '@mui/material/Input'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import styled from '@emotion/styled'

const StyledSelect = styled(Select)`
  height: 39px;
  > div {
    padding-left: 8px;
  }
`
const MenuItemRow = styled.div`
  display: flex;
  align-items: center;
`
const Value = styled.span`
  flex-basis: 85px;
  flex-shrink: 0;
`
const Comment = styled.span`
  font-size: 0.7em;
`

const ComparatorSelect = ({ comparator, onChange }) => (
  <StyledSelect
    value={comparator}
    onChange={onChange}
    input={<Input id="v-op" />}
  >
    <MenuItem value="ILIKE">
      <MenuItemRow>
        <Value>enthalten</Value>
        <Comment>Gross-Schreibung ignoriert</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value="LIKE">
      <MenuItemRow>
        <Value>enthalten</Value>
        <Comment>Gross-Schreibung berücksichtigt</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value="=">
      <MenuItemRow>
        <Value>&#61;</Value>
        <Comment>genau gleich</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value=">">
      <MenuItemRow>
        <Value>&#62;</Value>
        <Comment>(Zahlen wie Text sortiert)</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value=">=">
      <MenuItemRow>
        <Value>&#62;&#61;</Value>
        <Comment>(Zahlen wie Text sortiert)</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value="<">
      <MenuItemRow>
        <Value>&#60;</Value>
        <Comment>(Zahlen wie Text sortiert)</Comment>
      </MenuItemRow>
    </MenuItem>
    <MenuItem value="<=">
      <MenuItemRow>
        <Value>&#60;&#61;</Value>
        <Comment>(Zahlen wie Text sortiert)</Comment>
      </MenuItemRow>
    </MenuItem>
  </StyledSelect>
)

export default ComparatorSelect
