import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import MaterialCard from '@mui/material/Card'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import { useResizeDetector } from 'react-resize-detector'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'
import ProgressiveImg from './shared/ProgressiveImg'
import image from '../images/home.jpg'
import placeholderSrc from '../images/home_small.jpg'

const StyledSimpleBar = styled(SimpleBar)`
  max-height: 100%;
  height: 100%;
  .simplebar-content {
    /* without this image did not cover 100% on large screens */
    height: 100%;
  }
  .simplebar-scrollbar:before {
    background: rgba(0, 0, 0, 0.7) !important;
  }
`
const OuterContainer = styled.div`
  height: 100%;
  min-height: 100%;
  position: relative;
  overflow: hidden;
`
const ScrollContainer = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  overflow-y: auto;
  /* prevent layout shift when scrollbar appears */
  scrollbar-gutter: stable;
`
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props['data-width'] > 1700
      ? '1fr 1fr 1fr 1fr'
      : props['data-width'] > 1200
      ? '1fr 1fr 1fr'
      : props['data-width'] > 800
      ? '1fr 1fr'
      : '1fr'};
  gap: ${(props) =>
    props['data-width'] > 1700
      ? '65px'
      : props['data-width'] > 1200
      ? '50px'
      : props['data-width'] > 800
      ? '40px'
      : '30px'};
  p {
    margin-bottom: 10px !important;
  }
  p:last-of-type {
    margin-bottom: 0 !important;
    margin-top: 10px !important;
  }
  padding: ${(props) =>
    props['data-width'] > 1700
      ? '55px'
      : props['data-width'] > 1200
      ? '45px'
      : props['data-width'] > 800
      ? '35px'
      : '25px'};
  position: relative;
  color: black !important;
`
const Card = styled(MaterialCard)`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.55) !important;
  font-weight: 700;
  ul {
    margin-bottom: 0;
  }
  li:last-of-type {
    margin-bottom: 0;
  }
  li {
    font-weight: 500;
  }
`
const CardTitle = styled.h3`
  font-weight: 700;
`
const DokuLink = styled(Link)`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  &:hover {
    text-decoration: underline;
  }
`

const bgImageStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
}

const Home = () => {
  // trick to prevent with from being reset on routing
  const store = useContext(storeContext)
  const { homeWidth, setHomeWidth } = store
  const { width, ref } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  })
  useEffect(() => {
    if (width && width !== homeWidth) {
      setHomeWidth(width)
    }
  }, [homeWidth, setHomeWidth, width])

  return (
    <OuterContainer ref={ref} data-width={width}>
      <ProgressiveImg src={image} placeholderSrc={placeholderSrc} />
      <ScrollContainer>
        <CardContainer data-width={width}>
          <Card>
            <CardTitle>Informationen zu:</CardTitle>
            <CardTitle>Arten, Lebensräumen und ihren Taxonomien</CardTitle>
          </Card>
          <Card>
            <CardTitle>...nachschlagen</CardTitle>Eigenschaften finden. Auch von
            Synonymen aus anderen Taxonomien
          </Card>
          <Card>
            <CardTitle>...exportieren</CardTitle>Eigenschaften wählen, Arten
            filtern
          </Card>
          <Card>
            <CardTitle>...direkt einbinden</CardTitle>Daten direkt aus anderen
            Anwendungen abfragen
          </Card>
          <Card>
            <CardTitle>...importieren und ändern</CardTitle>Benutzer mit Konto
            können Eigenschaften importieren oder direkt bearbeiten
          </Card>
          <Card>
            <CardTitle>Mehr Info:</CardTitle>
            <DokuLink to="/Dokumentation/projektbeschreibung">
              in der Dokumentation
            </DokuLink>
          </Card>
        </CardContainer>
      </ScrollContainer>
    </OuterContainer>
  )
}

export default observer(Home)
