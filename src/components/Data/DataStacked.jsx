import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAtomValue } from 'jotai'
import { Outlet } from 'react-router'

import { Tree } from '../Tree/index.jsx'
import { windowHeightAtom } from '../../jotaiStore/index.ts'

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
        {tab === 1 && <Outlet />}
      </div>
    </>
  )
}
