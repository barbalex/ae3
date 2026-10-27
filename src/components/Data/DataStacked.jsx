import { useState, Suspense } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAtomValue } from 'jotai'
import { Outlet } from 'react-router'

import { Tree } from '../Tree/index.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { windowHeightAtom } from '../../store/index.ts'

import styles from './DataStacked.module.css'

export const DataStacked = () => {
  const windowHeight = useAtomValue(windowHeightAtom)

  const [tab, setTab] = useState(0)
  const onChangeTab = (event, value) => setTab(value)

  return (
    <>
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
          <Tab
            label="Formular"
            disabled={false}
          />
        </Tabs>
      </Paper>
      <div
        // the following height is needed for home to scroll
        style={{ height: windowHeight - 103 }}
      >
        {tab === 0 && <Tree />}
        {tab === 1 && (
          // scope suspending data panes here so they never blank the tree
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        )}
      </div>
    </>
  )
}
