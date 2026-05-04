import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAtomValue } from 'jotai'

import { ChooseColumn } from './ChooseColumn/index.jsx'
import { PreviewColumn } from './PreviewColumn/index.jsx'
import { windowWidthAtom } from '../../store/index.ts'

import styles from './ExportStacked.module.css'

export const ExportStacked = () => {
  const windowWidth = useAtomValue(windowWidthAtom)
  const [tab, setTab] = useState(0)

  const onChangeTab = (event, value) => setTab(value)

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              color: 'rgba(0,0,0,1)',
              textShadow: '0 0 4px #fff, 0 0 2px #fff',
            },
            '& .MuiTab-root.Mui-selected': { color: '#c24600' },
            '& .MuiTabs-indicator': { backgroundColor: '#c24600' },
          }}
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
