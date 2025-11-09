import { container, list } from './Roles.module.css'

export const Roles = ({ orgUsers }) => (
  <div className={container}>
    <div className={list}>
      <ul>
        {orgUsers.map((u) => {
          const orgName = u?.organizationByOrganizationId?.name ?? ''
          const role = u?.role ?? ''
          const val = `${orgName}: ${role}`

          return <li key={val}>{val}</li>
        })}
      </ul>
    </div>
  </div>
)
