import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import OptionsChoosen from './OptionsChoosen'
import Preview from './Preview'
import storeContext from '../../../storeContext'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  padding: 5px 0;
`
const HowToDiv = styled.div`
  padding: 15px 10px 0 10px;
`

const Filter = () => {
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
}

export default observer(Filter)
