import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router'

import { AppBar } from './AppBar/index'
import { Spinner } from '../shared/Spinner'
const ActiveNodeArraySetter = lazy(() => import('../ActiveNodeArraySetter'))
const IdParameter = lazy(() => import('../IdParameter'))

import styles from './index.module.css'

const Layout = () => (
  <div className={styles.container}>
    <AppBar />
    <main>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </main>
    <Suspense fallback={<div />}>
      <ActiveNodeArraySetter />
      <IdParameter />
    </Suspense>
  </div>
)

export default Layout
