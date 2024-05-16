import { Suspense, lazy } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import AppBar from './AppBar'
import Spinner from '../shared/Spinner.jsx'
const ActiveNodeArraySetter = lazy(() => import('../ActiveNodeArraySetter'))
const IdParameter = lazy(() => import('../IdParameter'))

const Container = styled.div`
  @media print {
    height: auto;
    overflow: visible !important;
  }
`

const Layout = () => (
  <Container>
    <AppBar />
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
    <Suspense fallback={<div />}>
      <ActiveNodeArraySetter />
      <IdParameter />
    </Suspense>
  </Container>
)

export default Layout
