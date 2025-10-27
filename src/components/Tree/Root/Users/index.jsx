import { useLocation } from 'react-router'

import { Row } from '../../Row/index.jsx'
import { Users } from './Users.jsx'

export const UsersFolder = ({ count, isLoading }) => {
  const { pathname } = useLocation()

  const data = {
    label: 'Benutzer',
    id: 'BenutzerFolder',
    url: ['Benutzer'],
    childrenCount: count,
    info: isLoading ? '...' : count,
    menuType: 'CmBenutzerFolder',
  }

  const isOpen = pathname.startsWith('/Benutzer')

  return (
    <>
      {' '}
      <Row data={data} />
      {isOpen && <Users />}
    </>
  )
}
