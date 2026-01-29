import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SimpleBar from 'simplebar-react'
import { useLocation, useNavigate } from 'react-router'
import { Outlet } from 'react-router'
import { useAtomValue } from 'jotai'

import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Sidebar } from './Sidebar/index.jsx'
import { stackedAtom } from '../../store/index.ts'

import styles from './index.module.css'

const Docs = ({ height }) => {
  const stacked = useAtomValue(stackedAtom)

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pathElements = pathname.split('/').filter((p) => !!p)

  const [tab, setTab] = useState(0)
  const onChangeTab = (event, value) => {
    // console.log('Dokumentation, onChangeTab', { event, value, pathElements })
    setTab(value)
    if (value === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...rest] = pathElements
      navigate(`/${first}/`)
    }
  }

  useEffect(() => {
    pathElements.length > 1 && tab === 0 && setTab(1)
    pathElements.length === 1 && tab === 1 && setTab(0)
  }, [pathElements, tab])

  if (stacked) {
    return (
      <ErrorBoundary>
        <Paper className={styles.paper}>
          <Tabs
            variant="fullWidth"
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
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
