import { Suspense } from 'react'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { PCs } from './PCs/index.jsx'

export const PC = ({ count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Eigenschaften-Sammlungen')

  const data = {
    label: 'Eigenschaften-Sammlungen',
    id: 'Eigenschaften-Sammlungen',
    url: ['Eigenschaften-Sammlungen'],
    childrenCount: count,
    info: count,
    menuType: 'CmPCFolder',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && (
        <Suspense fallback={<LoadingRow level={2} />}>
          <PCs />
        </Suspense>
      )}
    </>
  )
}
