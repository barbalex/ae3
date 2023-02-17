import React from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

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
import Taxonomy from './Taxonomy'
import Objekt from './Objekt'
import PropertyCollection from './PropertyCollection'
import PCO from './PropertyCollection/PCO'
import RCO from './PropertyCollection/RCO'
import Export from './Export'
import Data from './Data'
import Layout from './Layout'

// Use react-router with outlets
// render routes in outlet inside Data
const RouterComponent = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<Data />}>
          <Route index element={<Home />} />
          <Route path="/Arten/*" element={() => null} />
          <Route path="/Arten/:taxId/*" element={<Taxonomy />} />
          <Route path="/Arten/:taxId/:objId/*" element={<Objekt />} />
          <Route path="/Lebensräume/*" element={() => null} />
          <Route path="/Lebensräume/:taxId/*" element={<Taxonomy />} />
          <Route path="/Lebensräume/:taxId/:objId/*" element={<Objekt />} />
          <Route path="/Eigenschaften-Sammlungen/*" element={() => null} />
          <Route
            path="/Eigenschaften-Sammlungen/:pcId/*"
            element={<PropertyCollection />}
          />
          <Route
            path="/Eigenschaften-Sammlungen/:pcId/Eigenschaften"
            element={<PCO />}
          />
          <Route
            path="/Eigenschaften-Sammlungen/:pcId/Beziehungen"
            element={<RCO />}
          />
          <Route path="/Benutzer/*" element={() => null} />
          <Route path="/Benutzer/:userId" element={<Benutzer />} />
          <Route path="/Organisationen/*" element={() => null} />
          <Route path="/Organisationen/:orgId" element={<Organisation />} />
          <Route path="*" element={<FourOhFour />} />
        </Route>
        <Route path="/Export/*" element={<Export />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dokumentation/*" element={<Docs />}>
          <Route index element={null} />
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
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default RouterComponent
