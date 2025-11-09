import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { container, list, a } from './PC.module.css'

export const TCs = ({ tcs }) => (
  <div className={container}>
    <div className={list}>
      <ul>
        {tcs.map((u) => {
          const elem2 = tcs.type === 'ART' ? 'Arten' : 'Lebensräume'
          const link = `${appBaseUrl}${encodeURIComponent(elem2)}/${u.id}`

          return (
            <li key={u.name}>
              <a
                href={link}
                target="_blank"
                className={a}
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
