import { useEffect, useState, useContext } from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SimpleBar from 'simplebar-react'
import { useLocation, useNavigate } from 'react-router'
import { Outlet } from 'react-router'

import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import Sidebar from './Sidebar/index.jsx'
import storeContext from '../../storeContext.js'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
`
const Doku = styled.div`
  padding: 25px;
  ul,
  ol {
    margin-top: 5px;
    padding-inline-start: 20px;
  }
  p,
  li {
    margin-bottom: 0;
    line-height: 1.5em;
  }
  h1,
  h2,
  h3,
  h4,
  ol {
    margin-bottom: 10px;
  }
`
export const DokuDate = styled.p`
  margin-bottom: 15px !important;
  color: grey;
`
const StyledPaper = styled(Paper)`
  background-color: #ffcc80 !important;
`
const Content = styled.div`
  height: 100%;
`

const Docs = ({ height }) => {
  const store = useContext(storeContext)
  const { stacked } = store

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const pathElements = pathname.split('/').filter((p) => !!p)

  const [tab, setTab] = useState(0)
  const onChangeTab = (event, value) => {
    // console.log('Dokumentation, onChangeTab', { event, value, pathElements })
    setTab(value)
    if (value === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...rest] = pathElements
      navigate(`/${first}/`)
    }
  }

  useEffect(() => {
    pathElements.length > 1 && tab === 0 && setTab(1)
    pathElements.length === 1 && tab === 1 && setTab(0)
  }, [pathElements, tab])

  if (stacked) {
    return (
      <ErrorBoundary>
        <StyledPaper>
          <Tabs
            variant="fullWidth"
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
          >
            <Tab label="Navigation" />
            <Tab label="Formular" />
          </Tabs>
        </StyledPaper>
        <Content>
          {tab === 0 && <Sidebar stacked={true} />}
          {tab === 1 && (
            <SimpleBar
              style={{ maxHeight: height, height: '100%', width: '100%' }}
            >
              <Doku>
                <Outlet />
              </Doku>
            </SimpleBar>
          )}
        </Content>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Container>
        <Sidebar />
        <SimpleBar style={{ maxHeight: height, height: '100%', width: '100%' }}>
          <Doku>
            <Outlet />
          </Doku>
        </SimpleBar>
      </Container>
    </ErrorBoundary>
  )
}

export default Docs
