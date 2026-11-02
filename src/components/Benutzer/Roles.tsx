import styles from './Roles.module.css'

type RolesProps = {
  orgUsers: any[]
}

export const Roles = ({ orgUsers }: RolesProps) => (
  <div className={styles.container}>
    <div className={styles.list}>
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
