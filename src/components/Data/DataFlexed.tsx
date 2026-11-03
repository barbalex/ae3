import { Suspense } from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Outlet } from 'react-router'

import { LazyTree } from './LazyTree'
import { ErrorBoundary } from '../shared/ErrorBoundary'
import { Spinner } from '../shared/Spinner'

import styles from './DataFlexed.module.css'

export const DataFlexed = () => (
  <ErrorBoundary>
    <ReflexContainer orientation="vertical">
      <ReflexElement
        flex={0.35}
        className="tree-reflex-element"
      >
        <Suspense fallback={<Spinner />}>
          <LazyTree />
        </Suspense>
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
