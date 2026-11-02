import Linkify from 'linkify-react'

import { appBaseUrl } from '../../modules/appBaseUrl'
import { ErrorBoundary } from './ErrorBoundary'

import styles from './UserReadOnly.module.css'

const linkifyOptions = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
    cursor: 'pointer',
    textDecorationColor: 'rgba(0, 0, 0, 0.3)',
    textDecorationStyle: 'dotted',
  },
}

type UserReadOnlyProps = {
  label: string
  user: { id: string; name?: string | null; email?: string | null } | null | undefined
}

export const UserReadOnly = ({ label, user }: UserReadOnlyProps) => {
  if (!user) return null

  const name = user ? user.name || '' : ''
  const email = user ? user.email || '' : ''
  const link = `${appBaseUrl}Benutzer/${user.id}`

  return (
    <ErrorBoundary>
      <Linkify options={linkifyOptions}>
        <div className={styles.container}>
          <p className={styles.labelClass}>{`${label}:`}</p>
          <div className={styles.userContainer}>
            <a
              href={link}
              target="_blank"
              className={styles.a}
            >
              {name}
            </a>
            <span>{` (${email})`}</span>
          </div>
        </div>
      </Linkify>
    </ErrorBoundary>
  )
}
