import { lazy, Children } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'

const Layout = lazy(() => import('./Layout/index'))
const Home = lazy(() => import('./Home'))
const Benutzer = lazy(() => import('./Benutzer/index'))
const Organisation = lazy(() => import('./Organisation/index'))
const Login = lazy(() => import('./Login/index'))
const FourOhFour = lazy(() => import('./404'))
const Docs = lazy(() => import('./Docs/index'))
const BrowserDoc = lazy(() => import('./Docs/docs/Browser'))
const MeldenDoc = lazy(() => import('./Docs/docs/Melden'))
const NeueArtDoc = lazy(() => import('./Docs/docs/NeueArt'))
const ProjektbeschreibungDoc = lazy(
  () => import('./Docs/docs/Projektbeschreibung'),
)
const SchnittstellenDoc = lazy(() => import('./Docs/docs/Schnittstellen'))
const Taxonomy = lazy(async () => ({
  default: (await import('./Taxonomy/index')).Taxonomy,
}))
const Objekt = lazy(async () => ({
  default: (await import('./Objekt/index')).Objekt,
}))
const PropertyCollection = lazy(async () => ({
  default: (await import('./PropertyCollection/index')).PropertyCollection,
}))
const PCO = lazy(async () => ({
  default: (await import('./PropertyCollection/PCO/index')).PCO,
}))
const RCO = lazy(async () => ({
  default: (await import('./PropertyCollection/RCO/index')).RCO,
}))
const Export = lazy(async () => ({
  default: (await import('./Export/index')).Export,
}))
const Data = lazy(async () => ({
  default: (await import('./Data/index')).Data,
}))
const RouterErrorBoundary = lazy(async () => ({
  default: (await import('./shared/RouterErrorBoundary'))
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
