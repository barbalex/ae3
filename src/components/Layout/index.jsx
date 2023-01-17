import React from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import AppBar from './AppBar'

const Container = styled.div`
  @media print {
    height: auto;
    overflow: visible !important;
  }
`

const Layout = () => (
  <Container>
    <AppBar />
    <Outlet />
  </Container>
)

export default Layout
