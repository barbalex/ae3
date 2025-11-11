import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router'

import { AppBar } from './AppBar/index.jsx'
import { Spinner } from '../shared/Spinner.jsx'
const ActiveNodeArraySetter = lazy(() => import('../ActiveNodeArraySetter.jsx'))
const IdParameter = lazy(() => import('../IdParameter.jsx'))

import { container } from './index.module.css'

const Layout = () => (
  <div className={container}>
    <AppBar />
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
    <Suspense fallback={<div />}>
      <ActiveNodeArraySetter />
      <IdParameter />
    </Suspense>
  </div>
)

export default Layout
