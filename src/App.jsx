import { useEffect, useState, Suspense, lazy, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { Analytics } from '@vercel/analytics/react'
import { useSetAtom, Provider as JotaiProvider } from 'jotai'

import 'simplebar-react/dist/simplebar.min.css'

import { theme } from './theme.js'
import './index.css'
import 'react-reflex/styles.css'
import { version as appVersion } from '../package.json'

import { getActiveNodeArrayFromPathname } from './modules/getActiveNodeArrayFromPathname.js'
import { store, activeNodeArrayAtom, queryClientAtom } from './store/index.ts'
import { detectIE } from './modules/detectIE.js'
import { Router } from './components/Router.jsx'
import { Spinner } from './components/shared/Spinner.jsx'
const Stacker = lazy(async () => ({
  default: (await import('./components/Stacker.jsx')).Stacker,
}))

export const App = () => {
  const setActiveNodeArray = useSetAtom(activeNodeArrayAtom)

  useEffect(() => {
    const baseTitle = 'arteigenschaften'
    document.title = `${baseTitle} ${appVersion}`
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
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Suspense fallback={<Spinner />}>
              <Router />
            </Suspense>
            <Suspense fallback={<div />}>
              <Stacker />
            </Suspense>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
        <Analytics debug={false} />
      </JotaiProvider>
  )
}
