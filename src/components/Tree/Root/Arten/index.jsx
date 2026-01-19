import { Suspense } from 'react'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { Tax } from '../LR/Tax.jsx'

export const Arten = ({ count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Arten')

  const data = {
    label: 'Arten',
    id: 'Arten',
    url: ['Arten'],
    childrenCount: count,
    info: `${count} Taxonomien`,
    menuType: 'CmType',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && (
        <Suspense fallback={<LoadingRow level={2} />}>
          <Tax type="Arten" />
        </Suspense>
      )}
    </>
  )
}
