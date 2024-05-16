import { useLocation } from 'react-router-dom'

import Row from '../../Row/index.jsx'
import PCs from './PCs/index.jsx'

const PcNode = ({ isLoading, count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Eigenschaften-Sammlungen')

  const data = {
    label: 'Eigenschaften-Sammlungen',
    id: 'Eigenschaften-Sammlungen',
    url: ['Eigenschaften-Sammlungen'],
    childrenCount: count,
    info: isLoading ? '...' : count,
    menuType: 'CmPCFolder',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && <PCs />}
    </>
  )
}

export default PcNode
