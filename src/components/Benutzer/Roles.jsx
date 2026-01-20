import styles from './Roles.module.css'

export const Roles = ({ orgUsers }) => (
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
