import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'

const StyledNode = styled.div`
  height: 23px;
  max-height: 23px;
  box-sizing: border-box;
  margin: 0;
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  user-select: none;
`
const StyledIcon = styled(CircularProgress)`
  font-size: small;
  width: 20px !important;
  height: 20px !important;
`

export const LoadingRow = ({ level }) => (
  <StyledNode style={{ paddingLeft: level * 17 - 5 }}>
    <StyledIcon />
  </StyledNode>
)
