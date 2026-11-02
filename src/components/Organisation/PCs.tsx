import { Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { appBaseUrl } from '../../modules/appBaseUrl'
import { activeNodeArrayAtom } from '../../store'
import { apiFetch } from '../../modules/api'
import { Spinner } from '../shared/Spinner'
import { ErrorBoundary } from '../shared/ErrorBoundary'

import styles from './PCs.module.css'

export const PCs = () => {
  const activeNodeArray = useAtomValue(activeNodeArrayAtom)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error } = useQuery({
    queryKey: ['organizationPCs', id],
    queryFn: () =>
      apiFetch(`/property_collection?organization_id=eq.${id}&select=id,name`),
  })

  const pcs = sortBy(data ?? [], ['name'])

  if (error)
    return <div className={styles.container}>{`Fehler: ${error.message}`}</div>

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.container}>
          <div className={styles.list}>
            <ul>
              {pcs.map((u: any) => (
                <li key={u.name}>
                  <a
                    href={`${appBaseUrl}Eigenschaften-Sammlungen/${u.id}`}
                    target="_blank"
                    className={styles.a}
                  >
                    {u.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
