import { useState, useContext, useEffect } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Icon from '@mui/material/Icon'
import { MdShare as ShareIcon } from 'react-icons/md'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useLocation, useNavigate, Link } from 'react-router'

import { getActiveObjectIdFromNodeArray } from '../../../modules/getActiveObjectIdFromNodeArray.js'
import { storeContext } from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { MoreMenu } from './MoreMenu.jsx'

import {} from './index.module.css'

/**
 * For unknown reason AppBar does not follow display flex when
 * user form is shown: user covers AppBar!!??
 * Container with display block is needed to prevent that
 */
const Container = styled.div`
  display: block;
`
const StyledAppBar = styled(MuiAppBar)`
  background-color: #e65100 !important;
  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  flex-wrap: nowrap;
`
const Buttons = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`
const StyledButton = styled(Button)`
  color: rgb(255, 255, 255) !important;
  margin: 8px;
  hyphens: manual;
  white-space: nowrap;
`
const ShareButton = styled(Button)`
  color: rgb(255, 255, 255) !important;
  margin: 8px;
  hyphens: manual;
  white-space: nowrap;
  min-width: 40px !important;
  max-width: 40px;
  padding-top: 0 !important;
  .MuiIcon-root {
    height: 30px;
  }
`
const StyledMoreVertIcon = styled(ShareIcon)`
  color: white !important;
`
const TitleContainer = styled.div`
  flex: 1;
  margin-left: -20px;
`
const SiteTitle = styled(Button)`
  color: white !important;
  font-size: 20px !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  :hover {
    border-width: 1px !important;
  }
`
const getInitials = (name) => name.match(/\b(\w)/g).join('')

const query = gql`
  query ObjectQuery(
    $objectId: UUID!
    $existsObjectId: Boolean!
    $pCId: UUID!
    $existsPCId: Boolean!
    $taxId: UUID!
    $existsTaxId: Boolean!
  ) {
    objectById(id: $objectId) @include(if: $existsObjectId) {
      id
      name
    }
    propertyCollectionById(id: $pCId) @include(if: $existsPCId) {
      id
      name
    }
    taxonomyById(id: $taxId) @include(if: $existsTaxId) {
      id
      name
    }
  }
`

export const AppBar = observer(() => {
  const store = useContext(storeContext)
  const { login, singleColumnView } = store
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const location = useLocation()
  const navigate = useNavigate()

  const objectId = getActiveObjectIdFromNodeArray(activeNodeArray)
  let pCId = '99999999-9999-9999-9999-999999999999'
  if (activeNodeArray[0] === 'Eigenschaften-Sammlungen' && activeNodeArray[1]) {
    pCId = activeNodeArray[1]
  }
  const existsPCId = pCId !== '99999999-9999-9999-9999-999999999999'
  let taxId = '99999999-9999-9999-9999-999999999999'
  if (
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0]) &&
    activeNodeArray[1]
  ) {
    taxId = activeNodeArray[1]
  }
  const existsTaxId = taxId !== '99999999-9999-9999-9999-999999999999'
  const { data } = useQuery(query, {
    variables: {
      objectId: objectId || '99999999-9999-9999-9999-999999999999',
      existsObjectId: !!objectId,
      pCId,
      existsPCId,
      taxId,
      existsTaxId,
    },
  })

  const [wide, setWide] = useState(false)
  useEffect(() => {
    if (!singleColumnView && !wide) {
      setWide(true)
    }
    if (singleColumnView && wide) {
      setWide(false)
    }
  }, [wide, singleColumnView])

  const url0 = activeNodeArray[0] && activeNodeArray[0].toLowerCase()
  const { username } = login
  const loginLabel =
    username ?
      wide ? username
      : getInitials(username)
    : wide ? 'Login'
    : 'n.a.'
  const loginTitle = username ? 'abmelden' : 'anmelden'
  const objektName = data?.objectById?.name
  const pCName = data?.propertyCollectionById?.name
  const taxName = data?.taxonomyById?.name

  const onClickColumnButtonDocs = () => navigate('/Dokumentation')
  const onClickColumnButtonData = () => navigate('/')
  const onClickColumnButtonExport = () => navigate('/Export')
  const onClickColumnButtonLogin = () => navigate('/Login')
  const onClickShare = () => {
    const name =
      pCName ? pCName
      : objektName ? `${taxName}: ${objektName}`
      : taxName ? taxName
      : url0 ? url0
      : ''
    const title = `arteigenschaften.ch${name ? ': ' : ''}${name}`
    typeof window !== 'undefined' &&
      navigator.share({
        title,
        url: window.location.href,
      })
  }
  const { pathname } = location
  const pathArray = pathname.split('/').filter((a) => !!a)

  return (
    <ErrorBoundary>
      <Container>
        <StyledAppBar position="static">
          <div>
            <StyledToolbar>
              {wide ?
                <TitleContainer>
                  <SiteTitle
                    variant="outlined"
                    component={Link}
                    to="/"
                    title="Home"
                  >
                    Arteigenschaften
                  </SiteTitle>
                </TitleContainer>
              : <div />}
              <Buttons>
                <div>
                  <StyledButton
                    onClick={onClickColumnButtonData}
                    style={{
                      border:
                        pathArray[0] === 'Daten' || pathArray.length === 0 ?
                          '1px solid'
                        : 'none',
                    }}
                  >
                    Daten
                  </StyledButton>
                </div>
                <div>
                  <StyledButton
                    onClick={onClickColumnButtonExport}
                    style={{
                      border: pathname === '/Export' ? '1px solid' : 'none',
                    }}
                  >
                    Export
                  </StyledButton>
                </div>
                <div>
                  <StyledButton
                    onClick={onClickColumnButtonLogin}
                    title={loginTitle}
                    color="inherit"
                    style={{
                      border: pathname === '/Login' ? '1px solid' : 'none',
                      minWidth: wide ? 'inherit' : '40px',
                      maxWidth: wide ? 'inherit' : '40px',
                    }}
                  >
                    {loginLabel}
                  </StyledButton>
                </div>
                <div>
                  <StyledButton
                    onClick={onClickColumnButtonDocs}
                    style={{
                      border:
                        pathname.includes('/Dokumentation') ? '1px solid' : (
                          'none'
                        ),
                    }}
                  >
                    Dokumentation
                  </StyledButton>
                </div>
                {typeof navigator !== 'undefined' &&
                  navigator.share !== undefined && (
                    <>
                      <ShareButton
                        aria-label="teilen"
                        onClick={onClickShare}
                        color="inherit"
                      >
                        <Icon>
                          <StyledMoreVertIcon />
                        </Icon>
                      </ShareButton>
                    </>
                  )}
                <div>
                  <MoreMenu />
                </div>
              </Buttons>
            </StyledToolbar>
          </div>
        </StyledAppBar>
      </Container>
    </ErrorBoundary>
  )
})
