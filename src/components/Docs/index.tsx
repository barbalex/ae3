import { useState, useMemo } from 'react'
import type { SyntheticEvent } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SimpleBar from 'simplebar-react'
import { useLocation, useNavigate } from 'react-router'
import { Outlet } from 'react-router'
import { useAtomValue } from 'jotai'

import { ErrorBoundary } from '../shared/ErrorBoundary'
import { Sidebar } from './Sidebar/index'
import { stackedAtom } from '../../store'

import styles from './index.module.css'

type DocsProps = {
  height?: number | string
}

const Docs = ({ height }: DocsProps) => {
  const stacked = useAtomValue(stackedAtom)

  const navigate = useNavigate()
  const { pathname } = useLocation()
  // stable identity per pathname: the prevPathElements comparison
  // below depends on it, and without the memo a fresh array every
  // render would loop the render-time sync (vitest runs without the
  // react compiler, so this cannot be left to it)
  const pathElements = useMemo(
    () => pathname.split('/').filter((p) => !!p),
    [pathname],
  )

  const [tab, setTab] = useState(0)
  const onChangeTab = (event: SyntheticEvent, value: number) => {
    // console.log('Dokumentation, onChangeTab', { event, value, pathElements })
    setTab(value)
    if (value === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...rest] = pathElements
      navigate(`/${first}/`)
    }
  }

  // keep the tab in sync with the url depth — during render instead
  // of in an effect (https://react.dev/learn/you-might-not-need-an-effect)
  const [prevPathElements, setPrevPathElements] = useState(pathElements)
  if (pathElements !== prevPathElements) {
    setPrevPathElements(pathElements)
    if (pathElements.length > 1 && tab === 0) setTab(1)
    if (pathElements.length === 1 && tab === 1) setTab(0)
  }

  if (stacked) {
    return (
      <ErrorBoundary>
        <Paper className={styles.paper}>
          <Tabs
            variant="fullWidth"
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                color: 'var(--ae-text-primary)',
                textShadow:
                  '0 0 4px var(--ae-text-shadow-color), 0 0 2px var(--ae-text-shadow-color)',
              },
              '& .MuiTab-root.Mui-selected': {
                color: 'var(--ae-tab-selected)',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--ae-tab-selected)',
              },
            }}
          >
            <Tab label="Navigation" />
            <Tab label="Formular" />
          </Tabs>
        </Paper>
        <div className={styles.content}>
          {tab === 0 && <Sidebar stacked={true} />}
          {tab === 1 && (
            <SimpleBar
              style={{ maxHeight: height, height: '100%', width: '100%' }}
            >
              <div className={styles.doku}>
                <Outlet />
              </div>
            </SimpleBar>
          )}
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Sidebar />
        <SimpleBar style={{ maxHeight: height, height: '100%', width: '100%' }}>
          <div className={styles.doku}>
            <Outlet />
          </div>
        </SimpleBar>
      </div>
    </ErrorBoundary>
  )
}

export default Docs
