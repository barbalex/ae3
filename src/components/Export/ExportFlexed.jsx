import React from 'react'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'

import ChooseColumn from './ChooseColumn/index.jsx'
import PreviewColumn from './PreviewColumn/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

const ExportFlexed = () => (
  <ReflexContainer orientation="vertical">
    <ReflexElement flex={0.5} className="tree-reflex-element">
      <ErrorBoundary>
        <ChooseColumn />
      </ErrorBoundary>
    </ReflexElement>
    <ReflexSplitter key="treeSplitter" />
    <ReflexElement>
      <ErrorBoundary>
        <PreviewColumn />
      </ErrorBoundary>
    </ReflexElement>
  </ReflexContainer>
)

export default ExportFlexed
