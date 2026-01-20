import { Link } from 'react-router'
import Card from '@mui/material/Card'

// maybe use https://uploadcare.com/docs/delivery/adaptive-delivery/#adaptive-delivery
import { ProgressiveImg } from './shared/ProgressiveImg.tsx'
import image from '../images/home.webp'
import placeholderSrc from '../images/home_small.webp'

import styles from './Home.module.css'

const Home = () => (
  <div className={styles.container}>
    <ProgressiveImg
      src={image}
      placeholderSrc={placeholderSrc}
    />
    <div className={styles.scrollContainer}>
      <div className={styles.cardContainer}>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>Informationen zu:</h3>
          Arten, Lebensräumen und ihren Taxonomien
        </Card>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>...nachschlagen</h3>Eigenschaften
          finden.
          <br />
          Auch von Synonymen aus anderen Taxonomien
        </Card>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>...exportieren</h3>Eigenschaften
          wählen, Arten filtern
        </Card>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>...direkt einbinden</h3>Daten direkt
          aus anderen Anwendungen abfragen
        </Card>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>...importieren und ändern</h3>
          Benutzer mit Konto können Eigenschaften importieren oder direkt
          bearbeiten
        </Card>
        <Card className={styles.card}>
          <h3 className={styles.cardTitle}>Mehr Info:</h3>
          <Link
            className={styles.dokuLink}
            to="/Dokumentation/projektbeschreibung"
          >
            in der Dokumentation
          </Link>
        </Card>
      </div>
    </div>
  </div>
)

export default Home
