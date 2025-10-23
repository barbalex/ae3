import { useMemo, useContext } from 'react'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'
import { useQuery } from '@tanstack/react-query'

import { Filter } from './Filter/index.jsx'
import { treeQuery } from './treeQuery.js'
import { CmBenutzerFolder } from './contextmenu/BenutzerFolder.jsx'
import CmBenutzer from './contextmenu/Benutzer.jsx'
import CmObject from './contextmenu/Object.jsx'
import CmTaxonomy from './contextmenu/Taxonomy.jsx'
import CmType from './contextmenu/Type.jsx'
import CmPCFolder from './contextmenu/PCFolder.jsx'
import CmPC from './contextmenu/PC.jsx'
import storeContext from '../../storeContext.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { constants } from '../../modules/constants.js'
import { Root } from './Root/index.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'

const ErrorContainer = styled.div`
  padding: 24px;
`
const Container = styled.div`
  height: 100%;
  /*display: flex;
  flex-direction: column;
  overflow: hidden;*/
  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }

  /*
   * context menu
   */

  .react-contextmenu {
    display: flex;
    flex-direction: column;
    min-width: 100px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    background-color: rgb(66, 66, 66);
    background-clip: padding-box;
    border: 1px solid grey;
    border-radius: 0.25rem;
    outline: none;
    opacity: 0;
    pointer-events: none;
    font-family: 'Roboto', sans-serif;
  }

  .react-contextmenu.react-contextmenu--visible {
    color: white;
    opacity: 1;
    pointer-events: auto;
    z-index: 1000;
  }

  .react-contextmenu-title {
    opacity: 0;
  }

  .react-contextmenu--visible .react-contextmenu-title {
    color: #b3b3b3;
    padding-left: 10px;
    padding-right: 15px;
    padding-bottom: 3px;
    opacity: 1;
  }

  .react-contextmenu > .react-contextmenu-item {
    display: inline-block;
    padding: 3px 20px;
    clear: both;
    font-weight: 400;
    line-height: 1.5;
    color: white;
    text-align: inherit;
    white-space: nowrap;
    background: 0 0;
    border: 0;
    text-decoration: none;
    cursor: pointer;
  }

  .react-contextmenu-item.active,
  .react-contextmenu-item:hover {
    color: #f57c00;
    border-color: #0275d8;
    text-decoration: none;
  }
  .react-contextmenu-divider {
    border-top: 1px solid grey;
    margin-top: 4px;
    margin-bottom: 7px;
  }
  .react-contextmenu-submenu {
    padding-right: 27px !important;
  }

  .react-contextmenu-submenu:after {
    content: '▶';
    display: inline-block;
    position: absolute;
    right: 7px;
    bottom: 3px;
  }
`

const getUserIsTaxWriter = (data) => {
  const userRoles = (
    data?.data?.userByName?.organizationUsersByUserId?.nodes ?? []
  ).map((r) => r?.role)
  return (
    userRoles.includes('orgAdmin') || userRoles.includes('orgTaxonomyWriter')
  )
}

export const Tree = observer(() => {
  const store = useContext(storeContext)

  const apolloClient = useApolloClient()

  const { error, data } = useQuery({
    queryKey: ['tree', 'userRole', store.login.username],
    queryFn: () =>
      apolloClient.query({
        query: treeQuery,
        variables: { username: store.login.username ?? '' },
        // seems that react-query cache is not working
        // no idea why
        fetchPolicy: 'no-cache',
      }),
  })

  const userIsTaxWriter = getUserIsTaxWriter(data)

  if (error) {
    return (
      <ErrorContainer>{`Error fetching data: ${error.message}`}</ErrorContainer>
    )
  }

  return (
    <ErrorBoundary>
      <Container>
        <Filter />
        <SimpleBar
          style={{
            height: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
            flex: '1 1 auto',
            overflowY: 'auto',
            contain: 'paint layout style',
          }}
        >
          <Root />
        </SimpleBar>
        <IntoViewScroller />
        <CmBenutzerFolder />
        <CmBenutzer />
        {userIsTaxWriter && (
          <>
            <CmObject />
            <CmTaxonomy />
            <CmType />
            <CmPCFolder />
            <CmPC />
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
})
