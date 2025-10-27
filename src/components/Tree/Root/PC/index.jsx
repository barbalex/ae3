import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { PCs } from './PCs/index.jsx'

export const PC = ({ isLoading, count }) => {
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
