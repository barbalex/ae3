import { useLocation } from 'react-router-dom'

import Row from '../../Row'
import Organizations from './Organizations'

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
