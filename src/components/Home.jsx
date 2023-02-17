import React from 'react'
import { Link } from 'react-router-dom'
import MaterialCard from '@mui/material/Card'
import styled from '@emotion/styled'

// maybe use https://uploadcare.com/docs/delivery/adaptive-delivery/#adaptive-delivery
import ProgressiveImg from './shared/ProgressiveImg'
import image from '../images/home.jpg'
import placeholderSrc from '../images/home_small.jpg'

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
// TODO:
// use container-queries when they are supported by all browsers
// meanwhile: dedice width from window width
// stacked when < 700
// tree: in standard .35 of width
const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  padding: 25px;
  @media (min-width: 1231px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 35px;
  }
  @media (min-width: 1847px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 50px;
    padding: 45px;
  }
  p {
    margin-bottom: 10px !important;
  }
  p:last-of-type {
    margin-bottom: 0 !important;
    margin-top: 10px !important;
  }
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

const Home = () => (
  <OuterContainer>
    <ProgressiveImg src={image} placeholderSrc={placeholderSrc} />
    <ScrollContainer>
      <CardContainer>
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

export default Home
