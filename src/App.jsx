import { useEffect, useState, Suspense, lazy, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { Analytics } from '@vercel/analytics/react'
import { useSetAtom, useAtomValue, Provider as JotaiProvider } from 'jotai'

import 'simplebar-react/dist/simplebar.min.css'

import { lightTheme, darkTheme } from './theme.js'
import './index.css'
import 'react-reflex/styles.css'
import { version as appVersion } from '../package.json'

import { getActiveNodeArrayFromPathname } from './modules/getActiveNodeArrayFromPathname.js'
import {
  store,
  activeNodeArrayAtom,
  queryClientAtom,
  themeModeAtom,
} from './store/index.ts'
import { detectIE } from './modules/detectIE.js'
import { Router } from './components/Router.jsx'
import { Spinner } from './components/shared/Spinner.jsx'
const Stacker = lazy(async () => ({
  default: (await import('./components/Stacker.jsx')).Stacker,
}))

export const App = () => {
  const setActiveNodeArray = useSetAtom(activeNodeArrayAtom)
  // App renders the JotaiProvider itself, so the custom store must be
  // passed explicitly for atoms read in this component
  const themeMode = useAtomValue(themeModeAtom, { store })

  // track the OS color-scheme preference so 'system' mode can follow it live
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setSystemPrefersDark(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark)

  // mirror the resolved mode onto <html> so plain CSS (index.css, component
  // modules) can define dark variants via [data-theme='dark'];
  // index.html sets the same attribute before first paint
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#121212' : '#943400')
  }, [isDark])

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
          <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
