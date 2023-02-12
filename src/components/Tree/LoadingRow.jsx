import styled from '@emotion/styled'
import { MdHourglassEmpty as LoadingIcon } from 'react-icons/md'
import Icon from '@mui/material/Icon'

const singleRowHeight = 23
const StyledNode = styled.div`
  padding-left: ${(props) => `${Number(props['data-level']) * 17 - 17}px`};
  height: ${singleRowHeight}px;
  max-height: ${singleRowHeight}px;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  &:hover {
    color: #f57c00 !important;
  }
`
const SymbolIcon = styled(Icon)`
  margin-top: -2px !important;
  padding-left: 2px;
  font-size: 12px !important;
  width: 26px;
  max-width: 26px;
  &:hover {
    color: #f57c00 !important;
  }
`

const LoadingRow = ({ level }) => {
  //console.log('Row, data:', data)

  return (
    <StyledNode data-level={level}>
      <SymbolIcon id="symbol" className="material-icons">
        <LoadingIcon />
      </SymbolIcon>
      {/* <SymbolSpan>
          {' '}
        </SymbolSpan> */}
    </StyledNode>
  )
}

export default LoadingRow
