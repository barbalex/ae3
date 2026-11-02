import { Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { appBaseUrl } from '../../modules/appBaseUrl'
import { activeNodeArrayAtom } from '../../store'
import { apiFetch } from '../../modules/api'
import { Spinner } from '../shared/Spinner'
import { ErrorBoundary } from '../shared/ErrorBoundary'

import styles from './TCs.module.css'

export const TCs = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error } = useQuery({
    queryKey: ['organizationTCs', id],
    queryFn: () =>
      apiFetch(
        `/taxonomy?organization_id=eq.${id}&select=id,name,type`,
      ),
  })

  const tcs = sortBy(data ?? [], ['name'])

  if (error)
    return <div className={styles.container}>{`Fehler: ${error.message}`}</div>

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.container}>
          <div className={styles.list}>
            <ul>
              {tcs.map((u: any) => {
                const elem2 = u.type === 'Art' ? 'Arten' : 'Lebensräume'
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
      </Suspense>
    </ErrorBoundary>
  )
}
