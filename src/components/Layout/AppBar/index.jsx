import { useState, useContext, useEffect } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Icon from '@mui/material/Icon'
import { MdShare as ShareIcon } from 'react-icons/md'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useLocation, useNavigate, Link } from 'react-router'

import { getActiveObjectIdFromNodeArray } from '../../../modules/getActiveObjectIdFromNodeArray.js'
import { storeContext } from '../../../storeContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { MoreMenu } from './MoreMenu.jsx'

import styles from './index.module.css'

// https://mui.com/material-ui/react-menu/#customization
const ShareButton = styled((props) => <Button {...props} />)(() => ({
  '& .MuiIcon-root': { height: 30 },
}))

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
  const apolloClient = useApolloClient()

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

  // Ensure objectId is never null or undefined when passed to GraphQL
  const safeObjectId = objectId ?? '99999999-9999-9999-9999-999999999999'
  const existsObjectId = !!objectId

  const { data } = useQuery({
    queryKey: ['appBarData', objectId, pCId, taxId],
    queryFn: () =>
      apolloClient.query({
        query: query,
        variables: {
          objectId: safeObjectId,
          existsObjectId,
          pCId,
          existsPCId,
          taxId,
          existsTaxId,
        },
      }),
    enabled: existsObjectId || existsPCId || existsTaxId,
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
  const objektName = data?.data?.objectById?.name
  const pCName = data?.data?.propertyCollectionById?.name
  const taxName = data?.data?.taxonomyById?.name

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
      <div className={styles.container}>
        <MuiAppBar
          position="static"
          className={styles.appBar}
        >
          <div>
            <Toolbar className={styles.toolbar}>
              {wide ?
                <div className={styles.titleContainer}>
                  <Button
                    className={styles.siteTitle}
                    color="inherit"
                    variant="text"
                    component={Link}
                    to="/"
                    title="Home"
                  >
                    Arteigenschaften
                  </Button>
                </div>
              : <div />}
              <div className={styles.buttons}>
                <div>
                  <Button
                    className={styles.button}
                    onClick={onClickColumnButtonData}
                    color="inherit"
                    style={{
                      border:
                        pathArray[0] === 'Daten' || pathArray.length === 0 ?
                          '1px solid'
                        : 'none',
                    }}
                  >
                    Daten
                  </Button>
                </div>
                <div>
                  <Button
                    className={styles.button}
                    onClick={onClickColumnButtonExport}
                    color="inherit"
                    style={{
                      border: pathname === '/Export' ? '1px solid' : 'none',
                    }}
                  >
                    Export
                  </Button>
                </div>
                <div>
                  <Button
                    className={styles.button}
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
                  </Button>
                </div>
                <div>
                  <Button
                    className={styles.button}
                    onClick={onClickColumnButtonDocs}
                    color="inherit"
                    style={{
                      border:
                        pathname.includes('/Dokumentation') ? '1px solid' : (
                          'none'
                        ),
                    }}
                  >
                    Dokumentation
                  </Button>
                </div>
                {typeof navigator !== 'undefined' &&
                  navigator.share !== undefined && (
                    <ShareButton
                      className={styles.shareButton}
                      aria-label="teilen"
                      onClick={onClickShare}
                      color="inherit"
                    >
                      <Icon>
                        <ShareIcon className={styles.shareIcon} />
                      </Icon>
                    </ShareButton>
                  )}
                <div>
                  <MoreMenu />
                </div>
              </div>
            </Toolbar>
          </div>
        </MuiAppBar>
      </div>
    </ErrorBoundary>
  )
})
