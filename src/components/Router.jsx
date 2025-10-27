import { lazy, Children } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'

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
const Taxonomy = lazy(async () => ({
  default: (await import('./Taxonomy/index.jsx')).Taxonomy,
}))
const Objekt = lazy(async () => ({
  default: (await import('./Objekt/index.jsx')).Objekt,
}))
const PropertyCollection = lazy(async () => ({
  default: (await import('./PropertyCollection/index.jsx')).PropertyCollection,
}))
const PCO = lazy(async () => ({
  default: (await import('./PropertyCollection/PCO/index.jsx')).PCO,
}))
const RCO = lazy(async () => ({
  default: (await import('./PropertyCollection/RCO/index.jsx')).RCO,
}))
const Export = lazy(async () => ({
  default: (await import('./Export/index.jsx')).Export,
}))
const Data = lazy(async () => ({
  default: (await import('./Data/index.jsx')).Data,
}))
const RouterErrorBoundary = lazy(async () => ({
  default: (await import('./shared/RouterErrorBoundary.jsx'))
    .RouterErrorBoundary,
}))

// Use react-router with outlets
// render routes in outlet inside Data
export const Router = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<Layout />}
        errorElement={<RouterErrorBoundary />}
      >
        <Route
          path="/"
          element={<Data />}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            index
            element={<Home />}
            errorElement={<RouterErrorBoundary />}
          />
          <Route
            path="Arten"
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route path=":taxId">
              <Route
                index
                element={<Taxonomy />}
              />
              <Route
                path=":objId/*"
                element={<Objekt />}
              />
            </Route>
          </Route>
          <Route
            path="Lebensräume"
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route path=":taxId">
              <Route
                index
                element={<Taxonomy />}
              />
              <Route
                path=":objId/*"
                element={<Objekt />}
              />
            </Route>
          </Route>
          <Route
            path="Eigenschaften-Sammlungen"
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route path=":pcId">
              <Route
                index
                element={<PropertyCollection />}
              />
              <Route
                path="Eigenschaften"
                element={<PCO />}
              />
              <Route
                path="Beziehungen"
                element={<RCO />}
              />
            </Route>
          </Route>
          <Route
            path="Benutzer"
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route
              path=":userId"
              element={<Benutzer />}
            />
          </Route>
          <Route
            path="Organisationen"
            errorElement={<RouterErrorBoundary />}
          >
            <Route
              index
              element={<Home />}
            />
            <Route
              path=":orgId"
              element={<Organisation />}
            />
          </Route>
          <Route
            path="*"
            element={<FourOhFour />}
            errorElement={<RouterErrorBoundary />}
          />
        </Route>
        <Route
          path="Export/*"
          element={<Export />}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path="Login"
          element={<Login />}
          errorElement={<RouterErrorBoundary />}
        />
        <Route
          path="Dokumentation"
          element={<Docs />}
          errorElement={<RouterErrorBoundary />}
        >
          <Route
            index
            element={null}
          />
          <Route
            path="technische-voraussetzungen"
            element={<BrowserDoc />}
          />
          <Route
            path="fehler-melden"
            element={<MeldenDoc />}
          />
          <Route
            path="neue-art-erfassen"
            element={<NeueArtDoc />}
          />
          <Route
            path="projektbeschreibung"
            element={<ProjektbeschreibungDoc />}
          />
          <Route
            path="schnittstellen"
            element={<SchnittstellenDoc />}
          />
          <Route
            path="*"
            element={<FourOhFour />}
          />
        </Route>
        <Route
          path="*"
          element={<FourOhFour />}
          errorElement={<RouterErrorBoundary />}
        />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}
