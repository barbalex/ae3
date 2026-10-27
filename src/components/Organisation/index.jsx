import { useState, Suspense } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { PropertyReadOnly } from '../shared/PropertyReadOnly.jsx'
import { UserReadOnly } from '../shared/UserReadOnly.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { OrgUsers } from './OrgUsers/index.jsx'
import { TCs } from './TCs.jsx'
import { PCs } from './PCs.jsx'
import { apiFetch } from '../../modules/api.js'

import styles from './index.module.css'

const Organization = () => {
  const { orgId } = useParams()

  const { data, error } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () =>
      apiFetch(
        `/organization?id=eq.${orgId}&select=id,name,links,userByContact:contact(id,name,email)`,
      ),
  })

  const [tab, setTab] = useState(0)

  const onChangeTab = (event, value) => setTab(value)

  const org = data?.[0] ?? {}

  if (error) {
    return <div>{`Fehler: ${error.message}`}</div>
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={styles.orgContainer}>
          <PropertyReadOnly
            key="name"
            value={org?.name}
            label="Name"
          />
          <PropertyReadOnly
            key="links"
            value={org?.links ? org?.links.join(', ') : ''}
            label="Link(s)"
          />
          <UserReadOnly
            key="contact"
            user={org?.userByContact}
            label="Kontakt"
          />
        </div>
        <Paper className={styles.paper}>
          <Tabs
            variant="fullWidth"
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
          >
            <Tab label="Benutzer mit Rollen" />
            <Tab label="Taxonomien" />
            <Tab label="Eigenschaften-Sammlungen" />
          </Tabs>
        </Paper>
        {tab === 0 && <OrgUsers key={org?.id} />}
        {tab === 1 && <TCs />}
        {tab === 2 && <PCs />}
      </Suspense>
    </ErrorBoundary>
  )
}

export default Organization
