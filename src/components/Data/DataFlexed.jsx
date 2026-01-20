import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Outlet } from 'react-router'
import { observer } from 'mobx-react-lite'

import { Tree } from '../Tree/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import styles from './DataFlexed.module.css'

export const DataFlexed = observer(() => (
  <ErrorBoundary>
    <ReflexContainer orientation="vertical">
      <ReflexElement
        flex={0.35}
        className="tree-reflex-element"
      >
        <Tree />
      </ReflexElement>
      <ReflexSplitter key="treeSplitter" />
      <ReflexElement className={styles.dataElement}>
        <Outlet />
      </ReflexElement>
    </ReflexContainer>
  </ErrorBoundary>
))
