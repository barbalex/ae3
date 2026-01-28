import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAtomValue } from 'jotai'

import { ChooseColumn } from './ChooseColumn/index.jsx'
import { PreviewColumn } from './PreviewColumn/index.jsx'
import { windowWidthAtom } from '../../jotaiStore/index.ts'

import styles from './ExportStacked.module.css'

export const ExportStacked = () => {
  const windowWidth = useAtomValue(windowWidthAtom)
  const [tab, setTab] = useState(0)

  const onChangeTab = (event, value) => setTab(value)

  console.log('ExportStacked')

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
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
      <div className={styles.content}>
        {tab === 0 && <ChooseColumn dimensions={{ width: windowWidth }} />}
        {tab === 1 && <PreviewColumn dimensions={{ width: windowWidth }} />}
      </div>
    </div>
  )
}
