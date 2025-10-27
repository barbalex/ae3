import { useContext, Suspense } from 'react'
import { sortBy } from 'es-toolkit'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { appBaseUrl } from '../../modules/appBaseUrl.js'
import { storeContext } from '../../storeContext.js'
import { Spinner } from '../shared/Spinner.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`
const List = styled.div`
  column-width: 400px;
  margin-bottom: 10px;
  ul {
    -webkit-margin-before: 0px;
  }
`
const StyledA = styled.a`
  color: inherit;
  cursor: pointer;
  text-decoration-color: rgba(0, 0, 0, 0.3);
  text-decoration-style: dotted;
`

const pcsQuery = gql`
  query orgPCsQuery($id: UUID!) {
    organizationById(id: $id) {
      id
      propertyCollectionsByOrganizationId {
        totalCount
        nodes {
          id
          name
        }
      }
    }
  }
`

export const PCs = observer(() => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)
  const id =
    activeNodeArray.length > 1 ?
      activeNodeArray[1]
    : '99999999-9999-9999-9999-999999999999'

  const { data, error } = useQuery(pcsQuery, {
    variables: { id },
  })

  const pcs = sortBy(
    data?.organizationById?.propertyCollectionsByOrganizationId?.nodes ?? [],
    ['name'],
  )

  if (error) return <Container>{`Fehler: ${error.message}`}</Container>

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <Container>
          <List>
            <ul>
              {pcs.map((u) => (
                <li key={u.name}>
                  <StyledA
                    href={`${appBaseUrl}Eigenschaften-Sammlungen/${u.id}`}
                    target="_blank"
                  >
                    {u.name}
                  </StyledA>
                </li>
              ))}
            </ul>
          </List>
        </Container>
      </Suspense>
    </ErrorBoundary>
  )
})
