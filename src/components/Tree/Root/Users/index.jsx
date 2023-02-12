import { useLocation } from 'react-router-dom'

import Row from '../../Row'
import Users from './Users'

const UsersFolder = ({ count, isLoading }) => {
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

export default UsersFolder
