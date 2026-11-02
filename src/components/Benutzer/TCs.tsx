import { appBaseUrl } from '../../modules/appBaseUrl'
import styles from './PC.module.css'

type TCsProps = {
  tcs: any
}

export const TCs = ({ tcs }: TCsProps) => (
  <div className={styles.container}>
    <div className={styles.list}>
      <ul>
        {tcs.map((u: any) => {
          const elem2 = tcs.type === 'ART' ? 'Arten' : 'Lebensräume'
          const link = `${appBaseUrl}${encodeURIComponent(elem2)}/${u.id}`

          return (
            <li key={u.name}>
              <a
                href={link}
                target="_blank"
                className={styles.a}
              >
                {u.name}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  </div>
)
