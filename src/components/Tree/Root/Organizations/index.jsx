import { Suspense } from 'react'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { Organizations } from './Organizations.jsx'

export const OrganizationsFolder = ({ count }) => {
  const { pathname } = useLocation()

  const data = {
    label: 'Organisationen',
    id: 'OrganisationenFolder',
    url: ['Organisationen'],
    childrenCount: count,
    info: count,
    menuType: 'orgFolder',
  }

  const isOpen = pathname.startsWith('/Organisationen')

  return (
    <>
      <Row data={data} />
      {isOpen && (
        <Suspense fallback={<LoadingRow level={2} />}>
          <Organizations />
        </Suspense>
      )}
    </>
  )
}
