import React, { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const Layout = lazy(() => import('./Layout/index.jsx'))
const Home = lazy(() => import('./Home.jsx'))
const Benutzer = lazy(() => import('./Benutzer/index.jsx'))
const Organisation = lazy(() => import('./Organisation/index.jsx'))
const Login = lazy(() => import('./Login/index.jsx'))
const FourOhFour = lazy(() => import('./404.jsx'))
const Docs = lazy(() => import('./Docs/index.jsx'))
const BrowserDoc = lazy(() => import('./Docs/docs/Browser.jsx'))
const MeldenDoc = lazy(() => import('./Docs/docs/Melden.jsx'))
const NeueArtDoc = lazy(() => import('./Docs/docs/NeueArt.jsx'))
const ProjektbeschreibungDoc = lazy(
  () => import('./Docs/docs/Projektbeschreibung.jsx'),
)
const SchnittstellenDoc = lazy(() => import('./Docs/docs/Schnittstellen.jsx'))
const Taxonomy = lazy(() => import('./Taxonomy/index.jsx'))
const Objekt = lazy(() => import('./Objekt/index.jsx'))
const PropertyCollection = lazy(() => import('./PropertyCollection/index.jsx'))
const PCO = lazy(() => import('./PropertyCollection/PCO/index.jsx'))
const RCO = lazy(() => import('./PropertyCollection/RCO/index.jsx'))
const Export = lazy(() => import('./Export/index.jsx'))
const Data = lazy(() => import('./Data/index.jsx'))

// Use react-router with outlets
// render routes in outlet inside Data
const RouterComponent = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/" element={<Data />}>
          <Route index element={<Home />} />
          <Route path="/Arten/*" element={<Home />} />
          <Route path="/Arten/:taxId/*" element={<Taxonomy />} />
          <Route path="/Arten/:taxId/:objId/*" element={<Objekt />} />
          <Route path="/Lebensräume/*" element={<Home />} />
          <Route path="/Lebensräume/:taxId/*" element={<Taxonomy />} />
          <Route path="/Lebensräume/:taxId/:objId/*" element={<Objekt />} />
          <Route path="/Eigenschaften-Sammlungen/*" element={<Home />} />
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
          <Route path="/Benutzer/*" element={<Home />} />
          <Route path="/Benutzer/:userId" element={<Benutzer />} />
          <Route path="/Organisationen/*" element={<Home />} />
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
