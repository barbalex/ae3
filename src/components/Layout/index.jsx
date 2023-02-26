import { Suspense } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import AppBar from './AppBar'
import ActiveNodeArraySetter from '../ActiveNodeArraySetter'
import IdParameter from '../IdParameter'
import Spinner from '../shared/Spinner'

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
    <ActiveNodeArraySetter />
    <IdParameter />
  </Container>
)

export default Layout
