import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'

import { ChooseColumn } from './ChooseColumn/index'
import { PreviewColumn } from './PreviewColumn/index'
import { ErrorBoundary } from '../shared/ErrorBoundary'

export const ExportFlexed = () => (
  <ReflexContainer orientation="vertical">
    <ReflexElement
      flex={0.5}
      className="tree-reflex-element"
    >
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
