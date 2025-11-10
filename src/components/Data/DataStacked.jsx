import { useState, useContext } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router'

import { Tree } from '../Tree/index.jsx'
import { storeContext } from '../../storeContext.js'

import { paper } from './DataStacked.module.css'

export const DataStacked = observer(() => {
  const store = useContext(storeContext)
  const { windowHeight } = store

  const [tab, setTab] = useState(0)
  const onChangeTab = (event, value) => setTab(value)

  return (
    <>
      <Paper className={paper}>
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
})
