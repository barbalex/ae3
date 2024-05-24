import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { PropertyReadOnly } from '../shared/PropertyReadOnly.jsx'
import UserReadOnly from '../shared/UserReadOnly.jsx'
import Spinner from '../shared/Spinner.jsx'
import ErrorBoundary from '../shared/ErrorBoundary.jsx'
import OrgUsers from './OrgUsers/index.jsx'
import TCs from './TCs.jsx'
import PCs from './PCs.jsx'

const Container = styled.div``
const OrgContainer = styled.div`
  padding: 10px;
`
const StyledPaper = styled(Paper)`
  background-color: #ffcc80 !important;
`

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

  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(orgQuery, {
    variables: {
      orgId,
    },
  })

  const [tab, setTab] = useState(0)

  const onChangeTab = useCallback((event, value) => {
    setTab(value)
  }, [])

  const org = orgData?.organizationById ?? {}

  if (orgLoading) {
    return <Spinner />
  }
  if (orgError) {
    return <Container>{`Fehler: ${orgError.message}`}</Container>
  }

  return (
    <ErrorBoundary>
      <Container>
        <OrgContainer>
          <PropertyReadOnly key="name" value={org.name} label="Name" />
          <PropertyReadOnly
            key="links"
            value={org.links ? org.links.join(', ') : ''}
            label="Link(s)"
          />
          <UserReadOnly
            key="contact"
            user={org.userByContact}
            label="Kontakt"
          />
        </OrgContainer>
        <StyledPaper>
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
        </StyledPaper>
        {tab === 0 && <OrgUsers key={org.id} />}
        {tab === 1 && <TCs />}
        {tab === 2 && <PCs />}
      </Container>
    </ErrorBoundary>
  )
}

export default Organization
