import { useContext } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'
import { observer } from 'mobx-react-lite'

import {Tree} from '../Tree/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import storeContext from '../../storeContext.js'

const DataElement = styled(ReflexElement)`
  overflow-x: hidden !important;
`

export const DataFlexed = observer(() => {
  const store = useContext(storeContext)
  const { treeRefetchCounter } = store
  return (
    <ErrorBoundary>
      <ReflexContainer orientation="vertical">
        <ReflexElement
          flex={0.35}
          className="tree-reflex-element"
        >
          <Tree treeRefetchCounter={treeRefetchCounter} />
        </ReflexElement>
        <ReflexSplitter key="treeSplitter" />
        <DataElement>
          <Outlet />
        </DataElement>
      </ReflexContainer>
    </ErrorBoundary>
  )
})

