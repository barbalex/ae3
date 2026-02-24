import { useEffect, useState, Suspense, lazy, useMemo } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { Analytics } from '@vercel/analytics/react'
import { useSetAtom, Provider as JotaiProvider } from 'jotai'

import 'simplebar-react/dist/simplebar.min.css'

import { theme } from './theme.js'
import './index.css'
import 'react-reflex/styles.css'

import { getActiveNodeArrayFromPathname } from './modules/getActiveNodeArrayFromPathname.js'
import {
  store,
  activeNodeArrayAtom,
  apolloClientAtom,
  queryClientAtom,
} from './store/index.ts'
import { detectIE } from './modules/detectIE.js'
import { client } from './client.js'
import { Router } from './components/Router.jsx'
import { Spinner } from './components/shared/Spinner.jsx'
const Stacker = lazy(async () => ({
  default: (await import('./components/Stacker.jsx')).Stacker,
}))

export const App = () => {
  const setActiveNodeArray = useSetAtom(activeNodeArrayAtom)

  const myClient = useMemo(() => {
    const apolloClient = client()
    store.set(apolloClientAtom, apolloClient)
    return apolloClient
  }, [])

  const queryClient = useMemo(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // prevent tree refetching in dev mode
        },
      },
    })
    store.set(queryClientAtom, qc)
    return qc
  }, [])

  useEffect(() => {
    // initiate activeNodeArray
    setActiveNodeArray(getActiveNodeArrayFromPathname())
  }, [setActiveNodeArray])

  const ieVersion = detectIE()
  if (!!ieVersion && ieVersion < 12 && typeof window !== 'undefined') {
    return window.alert(`Sorry: Internet Explorer wird nicht unterstützt.
    Wir empfehlen eine aktuelle Version von Chrome, Edge, Firefox oder Safari`)
  }

  return (
    <JotaiProvider store={store}>
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
        <Analytics debug={false} />
      </ApolloProvider>
    </JotaiProvider>
  )
}
