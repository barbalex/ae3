import { useState, useContext } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { observer } from 'mobx-react-lite'

import { ChooseColumn } from './ChooseColumn/index.jsx'
import { PreviewColumn } from './PreviewColumn/index.jsx'
import { storeContext } from '../../storeContext.js'

import { paper, content } from './ExportStacked.module.css'

export const ExportStacked = observer(() => {
  const store = useContext(storeContext)
  const { windowWidth } = store
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
          <Tab label="Auswählen" />
          <Tab label="Vorschau" />
        </Tabs>
      </Paper>
      <div className={content}>
        {tab === 0 && <ChooseColumn dimensions={{ width: windowWidth }} />}
        {tab === 1 && <PreviewColumn dimensions={{ width: windowWidth }} />}
      </div>
    </>
  )
})
