import { appBaseUrl } from '../../modules/appBaseUrl'
import styles from './PC.module.css'

type PCsProps = {
  pcs: any[]
}

export const PCs = ({ pcs }: PCsProps) => (
  <div className={styles.container}>
    <div className={styles.list}>
      <ul>
        {pcs.map((u) => {
          const link = `${appBaseUrl}Eigenschaften-Sammlungen/${encodeURIComponent(
            u.id,
          )}`

          return (
            <li key={u.name}>
              <a
                className={styles.a}
                href={link}
                target="_blank"
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
