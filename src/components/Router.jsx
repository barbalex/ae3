import React, { lazy } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const Layout = lazy(() => import('./Layout'))
const Home = lazy(() => import('./Home'))
const Benutzer = lazy(() => import('./Benutzer'))
const Organisation = lazy(() => import('./Organisation'))
const Login = lazy(() => import('./Login'))
const FourOhFour = lazy(() => import('./404'))
const Docs = lazy(() => import('./Docs'))
const BrowserDoc = lazy(() => import('./Docs/docs/Browser'))
const MeldenDoc = lazy(() => import('./Docs/docs/Melden'))
const NeueArtDoc = lazy(() => import('./Docs/docs/NeueArt'))
const ProjektbeschreibungDoc = lazy(() =>
  import('./Docs/docs/Projektbeschreibung'),
)
const SchnittstellenDoc = lazy(() => import('./Docs/docs/Schnittstellen'))
const Taxonomy = lazy(() => import('./Taxonomy'))
const Objekt = lazy(() => import('./Objekt'))
const PropertyCollection = lazy(() => import('./PropertyCollection'))
const PCO = lazy(() => import('./PropertyCollection/PCO'))
const RCO = lazy(() => import('./PropertyCollection/RCO'))
const Export = lazy(() => import('./Export'))
const Data = lazy(() => import('./Data'))

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
