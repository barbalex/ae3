import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { Routes, Route } from 'react-router-dom'
import { getSnapshot } from 'mobx-state-tree'

import ErrorBoundary from './shared/ErrorBoundary'
import storeContext from '../storeContext'
import DataStacked from './Data/DataStacked'
import DataFlexed from './Data/DataFlexed'
import Home from './Home'
import Benutzer from './Benutzer'
import Organisation from './Organisation'
import Objekt from './Objekt'
import PCO from './PropertyCollection/PCO'
import RCO from './PropertyCollection/RCO'
import Taxonomy from './Taxonomy'
import PropertyCollection from './PropertyCollection'
import ExportStacked from './Export/ExportStacked'
import ExportFlexed from './Export/ExportFlexed'
import Login from './Login'
import FourOhFour from './404'
import Docs from './Docs'
import BrowserDoc from './Docs/docs/Browser'
import MeldenDoc from './Docs/docs/Melden'
import NeueArtDoc from './Docs/docs/NeueArt'
import ProjektbeschreibungDoc from './Docs/docs/Projektbeschreibung'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

// Use react-router with outlets
// render routes in outlet inside Data
const RouterComponent = () => {
  const store = useContext(storeContext)
  const { stacked } = store
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const showObjekt =
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0]) &&
    activeNodeArray.length > 0
  const showTaxonomy =
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0]) &&
    activeNodeArray.length === 1
  const showPC =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 2
  const showPCO =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 3 &&
    activeNodeArray[2] === 'Eigenschaften'
  const showRCO =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 3 &&
    activeNodeArray[2] === 'Beziehungen'

  return (
    <ErrorBoundary>
      <Container>
        <Routes>
          <Route path="/" element={stacked ? <DataStacked /> : <DataFlexed />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/Arten/*"
              element={
                showTaxonomy ? <Taxonomy /> : showObjekt ? <Objekt /> : null
              }
            />
            <Route
              path="/Lebensräume/*"
              element={
                showTaxonomy ? <Taxonomy /> : showObjekt ? <Objekt /> : null
              }
            />
            <Route
              path="/Eigenschaften-Sammlungen/*"
              element={
                showPC ? (
                  <PropertyCollection />
                ) : showPCO ? (
                  <PCO />
                ) : showRCO ? (
                  <RCO />
                ) : null
              }
            />
            <Route path="/Benutzer/*" element={<Benutzer />} />
            <Route path="/Organisationen/*" element={<Organisation />} />
          </Route>
          <Route
            path="/Export/*"
            element={stacked ? <ExportStacked /> : <ExportFlexed />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dokumentation/*" element={<Docs />}>
            <Route path="technische-voraussetzungen" element={<BrowserDoc />} />
            <Route path="fehler-melden" element={<MeldenDoc />} />
            <Route path="neue-art-erfassen" element={<NeueArtDoc />} />
            <Route
              path="projektbeschreibung"
              element={<ProjektbeschreibungDoc />}
            />
          </Route>
          <Route path="*" element={<FourOhFour />} />
        </Routes>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(RouterComponent)
