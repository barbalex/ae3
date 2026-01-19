import { useState, Suspense } from 'react'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { PropertyReadOnly } from '../shared/PropertyReadOnly.jsx'
import { UserReadOnly } from '../shared/UserReadOnly.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { OrgUsers } from './OrgUsers/index.jsx'
import { TCs } from './TCs.jsx'
import { PCs } from './PCs.jsx'

import { orgContainer, paper } from './index.module.css'

const orgQuery = gql`
  query orgQuery($orgId: UUID!) {
    organizationById(id: $orgId) {
      id
      name
      links
      contact
      userByContact {
        id
        name
        email
      }
      propertyCollectionsByOrganizationId {
        totalCount
        nodes {
          id
          name
        }
      }
      taxonomiesByOrganizationId {
        totalCount
        nodes {
          id
          name
        }
      }
      organizationUsersByOrganizationId {
        totalCount
        nodes {
          id
          userByUserId {
            id
            name
            email
          }
          role
        }
      }
    }
  }
`

const Organization = () => {
  const { orgId } = useParams()
  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () =>
      apolloClient.query({
        query: orgQuery,
        variables: { orgId },
      }),
  })

  const [tab, setTab] = useState(0)

  const onChangeTab = (event, value) => setTab(value)

  const org = data?.data?.organizationById ?? {}

  if (error) {
    return <div>{`Fehler: ${error.message}`}</div>
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <div className={orgContainer}>
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
        <Paper className={paper}>
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
