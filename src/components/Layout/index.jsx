import React from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import AppBar from './AppBar'
import ActiveNodeArraySetter from '../ActiveNodeArraySetter'
import IdParameter from '../IdParameter'

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
    <ActiveNodeArraySetter />
    <IdParameter />
  </Container>
)

export default Layout
