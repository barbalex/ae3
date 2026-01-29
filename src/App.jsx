import { useEffect, useState, Suspense, lazy } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { Analytics } from '@vercel/analytics/react'
import { useSetAtom } from 'jotai'

import 'simplebar-react/dist/simplebar.min.css'

import { theme } from './theme.js'
import './index.css'
import 'react-reflex/styles.css'

import { getActiveNodeArrayFromPathname } from './modules/getActiveNodeArrayFromPathname.js'
import { initializeIdb } from './modules/initializeIdb.js'
import { setLoginFromIdb } from './modules/setLoginFromIdb.js'
import { setLoginAtom, activeNodeArrayAtom } from './store/index.ts'
import { detectIE } from './modules/detectIE.js'
import { client } from './client.js'
import { IdbProvider } from './idbContext.js'
import { Router } from './components/Router.jsx'
import { Spinner } from './components/shared/Spinner.jsx'
const Stacker = lazy(async () => ({
  default: (await import('./components/Stacker.jsx')).Stacker,
}))

export const App = () => {
  const idb = initializeIdb()
  const setLogin = useSetAtom(setLoginAtom)
  const setActiveNodeArray = useSetAtom(activeNodeArrayAtom)

  useEffect(() => {
    setLoginFromIdb({ idb, setLogin }).then(
      () => {
        // initiate activeNodeArray
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

  const myClient = client({ idb })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // prevent tree refetching in dev mode
      },
    },
  })

  return (
    <IdbProvider value={idb}>
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
      <Analytics debug={false} />
    </IdbProvider>
  )
}
