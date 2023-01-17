import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './Home'
import Benutzer from './Benutzer'
import Organisation from './Organisation'
import Login from './Login'
import FourOhFour from './404'
import Docs from './Docs'
import BrowserDoc from './Docs/docs/Browser'
import MeldenDoc from './Docs/docs/Melden'
import NeueArtDoc from './Docs/docs/NeueArt'
import ProjektbeschreibungDoc from './Docs/docs/Projektbeschreibung'
import SchnittstellenDoc from './Docs/docs/Schnittstellen'
import TaxonomyOrObject from './TaxonomyOrObject'
import PcPcoOrRco from './PcPcoOrRco'
import Export from './Export'
import Data from './Data'
import Layout from './Layout'

// Use react-router with outlets
// render routes in outlet inside Data
const RouterComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Data />}>
          <Route index element={<Home />} />
          <Route path="/Arten/*" element={<TaxonomyOrObject />} />
          <Route path="/Lebensräume/*" element={<TaxonomyOrObject />} />
          <Route path="/Eigenschaften-Sammlungen/*" element={<PcPcoOrRco />} />
          <Route path="/Benutzer/*" element={<Benutzer />} />
          <Route path="/Organisationen/*" element={<Organisation />} />
          <Route path="*" element={<FourOhFour />} />
        </Route>
        <Route path="/Export/*" element={<Export />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dokumentation/*" element={<Docs />}>
          <Route path="technische-voraussetzungen" element={<BrowserDoc />} />
          <Route path="fehler-melden" element={<MeldenDoc />} />
          <Route path="neue-art-erfassen" element={<NeueArtDoc />} />
          <Route
            path="projektbeschreibung"
            element={<ProjektbeschreibungDoc />}
          />
          <Route path="schnittstellen" element={<SchnittstellenDoc />} />
          <Route path="*" element={<FourOhFour />} />
        </Route>
        <Route path="*" element={<FourOhFour />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default RouterComponent
