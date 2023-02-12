import { useLocation } from 'react-router-dom'

import Row from '../../Row'
import Tax from './Tax'

const ArtenNode = ({ isLoading, count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Arten')

  const data = {
    label: 'Arten',
    id: 'Arten',
    url: ['Arten'],
    childrenCount: count,
    info: `${isLoading ? '...' : count} Taxonomien`,
    menuType: 'CmType',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && <Tax />}
    </>
  )
}

export default ArtenNode
