import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'

const StyledNode = styled.div`
  padding-left: ${(props) => `${Number(props['data-level']) * 17 - 5}px`};
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
  <StyledNode data-level={level}>
    <StyledIcon />
  </StyledNode>
)
