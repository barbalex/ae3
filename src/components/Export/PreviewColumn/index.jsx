import { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import { OptionsChoosen } from './OptionsChoosen/index.jsx'
import Preview from './Preview.jsx'
import storeContext from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

const Container = styled.div`
  padding: 5px 0;
`
const HowToDiv = styled.div`
  padding: 15px 10px 0 10px;
`

export const PreviewColumn = observer(() => {
  const store = useContext(storeContext)
  const exportTaxonomies = store.export.taxonomies.toJSON()

  return (
    <ErrorBoundary>
      <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
        <Container>
          <OptionsChoosen />
          <Preview />
          {exportTaxonomies.length === 0 && (
            <HowToDiv>
              Sobald eine Taxonomie gewählt ist, werden hier Daten angezeigt.
            </HowToDiv>
          )}
        </Container>
      </SimpleBar>
    </ErrorBoundary>
  )
})
