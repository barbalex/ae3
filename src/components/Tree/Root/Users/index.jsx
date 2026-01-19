import { Suspense } from 'react'
import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { LoadingRow } from '../../LoadingRow.jsx'
import { Users } from './Users.jsx'

export const UsersFolder = ({ count }) => {
  const { pathname } = useLocation()

  const data = {
    label: 'Benutzer',
    id: 'BenutzerFolder',
    url: ['Benutzer'],
    childrenCount: count,
    info: count,
    menuType: 'CmBenutzerFolder',
  }

  const isOpen = pathname.startsWith('/Benutzer')

  return (
    <>
      {' '}
      <Row data={data} />
      {isOpen && (
        <Suspense fallback={<LoadingRow level={2} />}>
          <Users />
        </Suspense>
      )}
    </>
  )
}
