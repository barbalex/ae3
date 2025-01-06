import { useLocation } from 'react-router'

import Row from '../../Row/index.jsx'
import Tax from '../LR/Tax.jsx'

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
      {isOpen && <Tax type="Arten" />}
    </>
  )
}

export default ArtenNode
