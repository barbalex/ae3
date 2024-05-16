import { useLocation } from 'react-router-dom'

import Row from '../../Row/index.jsx'
import Tax from './Tax.jsx'

const LrNode = ({ isLoading, count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Lebensr%C3%A4ume')

  const data = {
    label: 'Lebensräume',
    id: 'Lebensraeume',
    url: ['Lebensräume'],
    childrenCount: count,
    info: `${isLoading ? '...' : count} Taxonomien`,
    menuType: 'CmType',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && <Tax type="Lebensräume" />}
    </>
  )
}

export default LrNode
