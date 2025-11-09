import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { container, list, a } from './PC.module.css'

export const PCs = ({ pcs }) => (
  <div className={container}>
    <div className={list}>
      <ul>
        {pcs.map((u) => {
          const link = `${appBaseUrl}Eigenschaften-Sammlungen/${encodeURIComponent(
            u.id,
          )}`

          return (
            <li key={u.name}>
              <a
                className={a}
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
