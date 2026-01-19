import { Suspense } from 'react'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { Tax } from './Tax.jsx'

export const LR = ({ count }) => {
  const { pathname } = useLocation()
  const isOpen = pathname.startsWith('/Lebensr%C3%A4ume')

  const data = {
    label: 'Lebensräume',
    id: 'Lebensraeume',
    url: ['Lebensräume'],
    childrenCount: count,
    info: `${count} Taxonomien`,
    menuType: 'CmType',
  }

  return (
    <>
      <Row data={data} />
      {isOpen && (
        <Suspense fallback={<LoadingRow level={2} />}>
          <Tax type="Lebensräume" />
        </Suspense>
      )}
    </>
  )
}
