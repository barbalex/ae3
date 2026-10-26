import { Suspense } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Outlet } from 'react-router'

import { Tree } from '../Tree/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'

import styles from './DataFlexed.module.css'

export const DataFlexed = () => (
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
        {/* scope suspending data panes here so they never blank the tree */}
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </ReflexElement>
    </ReflexContainer>
  </ErrorBoundary>
)
