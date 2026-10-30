import { useEffect } from 'react'
import {
  MdHourglassEmpty as LoadingIcon,
  MdMoreHoriz as MoreHorizIcon,
} from 'react-icons/md'

import styles from './Row/index.module.css'

// row ending a truncated list level; loads the next page via
// fetchMoreTreeRows. The virtualized list only mounts rows near the
// viewport, so this component mounting means it scrolled into view:
// fetch automatically (clicking works too). Not a regular tree node:
// no url, no id, no context menu
export const LoadMoreRow = ({ level, loading, queryKey, onMore }) => {
  const keyId = queryKey.join('/')
  useEffect(() => {
    if (!loading) onMore(keyId)
    // onMore is stable; keyId (unlike the key array) is a stable
    // primitive per list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, keyId])

  return (
    <div
      className={styles.node}
      onClick={loading ? undefined : () => onMore(keyId)}
      style={{ gridTemplateColumns: `${level * 23 - 23}px 23px 1fr` }}
    >
      <div className={styles.spacer} />
      <div className={styles.toggle}>
        {loading ?
          <LoadingIcon />
        : <MoreHorizIcon />}
      </div>
      <div className={styles.content}>
        <span className={styles.textSpan}>
          {loading ? 'lade Daten' : 'weitere Daten laden'}
        </span>
      </div>
    </div>
  )
}
