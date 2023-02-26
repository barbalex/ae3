import { useEffect, useState, Suspense, lazy } from 'react'
import { ApolloProvider } from '@apollo/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'

import 'simplebar-react/dist/simplebar.min.css'

// see: https://github.com/fontsource/fontsource/tree/master/packages/roboto-mono
import '@fontsource/roboto'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import theme from './theme'
import './index.css'
import 'react-reflex/styles.css'
import getActiveNodeArrayFromPathname from './modules/getActiveNodeArrayFromPathname'
import initializeIdb from './modules/initializeIdb'
import setLoginFromIdb from './modules/setLoginFromIdb'
import detectIE from './modules/detectIE'
import client from './client'
import { Provider as IdbProvider } from './idbContext'
import { Provider as MobxProvider } from './storeContext'
import Store from './store'
import Router from './components/Router'
import Spinner from './components/shared/Spinner'
const Stacker = lazy(() => import('./components/Stacker'))

const App = () => {
  const idb = initializeIdb()

  const [store, setStore] = useState()
  useEffect(() => {
    const storeWithoutLogin = Store().create()
    setLoginFromIdb({ idb, store: storeWithoutLogin }).then(
      (storeWithLogin) => {
        setStore(storeWithLogin)

        // initiate activeNodeArray
        const { setActiveNodeArray } = storeWithLogin
        setActiveNodeArray(getActiveNodeArrayFromPathname())
      },
    )
    // need to disable hook-deps because of:
    // 1. idb exists already on first render
    // 2. idb makes component rerender indefinitely
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ieVersion = detectIE()
  if (!!ieVersion && ieVersion < 12 && typeof window !== 'undefined') {
    return window.alert(`Sorry: Internet Explorer wird nicht unterstützt.
    Wir empfehlen eine aktuelle Version von Chrome, Edge, Firefox oder Safari`)
  }

  // on first render returns null
  if (!store) return null

  const myClient = client({ idb, store })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // prevent tree refetching in dev mode
      },
    },
  })

  return (
    <IdbProvider value={idb}>
      <MobxProvider value={store}>
        <ApolloProvider client={myClient}>
          <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <Suspense fallback={<Spinner />}>
                  <Router />
                </Suspense>
              </ThemeProvider>
              <Suspense fallback={<div />}>
                <Stacker />
              </Suspense>
            </StyledEngineProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </MobxProvider>
    </IdbProvider>
  )
}

export default App
