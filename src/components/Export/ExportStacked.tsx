import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAtomValue } from 'jotai'

import { ChooseColumn } from './ChooseColumn/index'
import { PreviewColumn } from './PreviewColumn/index'
import { windowWidthAtom } from '../../store'

import styles from './ExportStacked.module.css'

export const ExportStacked = () => {
  const windowWidth = useAtomValue(windowWidthAtom)
  const [tab, setTab] = useState(0)

  const onChangeTab = (event: SyntheticEvent, value: number) => setTab(value)

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
          <Tab label="Auswählen" />
          <Tab label="Vorschau" />
        </Tabs>
      </Paper>
      <div className={styles.content}>
        {tab === 0 && <ChooseColumn />}
        {tab === 1 && <PreviewColumn />}
      </div>
    </div>
  )
}
