import { useLocation } from 'react-router'

import Row from '../../Row/index.jsx'
import Organizations from './Organizations.jsx'

const OrganizationsFolder = ({ count, isLoading }) => {
  const { pathname } = useLocation()

  const data = {
    label: 'Organisationen',
    id: 'OrganisationenFolder',
    url: ['Organisationen'],
    childrenCount: count,
    info: isLoading ? '...' : count,
    menuType: 'orgFolder',
  }

  const isOpen = pathname.startsWith('/Organisationen')

  return (
    <>
      <Row data={data} />
      {isOpen && <Organizations />}
    </>
  )
}

export default OrganizationsFolder
