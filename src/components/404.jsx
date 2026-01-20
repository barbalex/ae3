import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router'

import { ErrorBoundary } from './shared/ErrorBoundary.jsx'
import styles from './404.module.css'

const FourOFour = () => {
  const navigate = useNavigate()
  const onClickBack = () => navigate('/')

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <Typography
            align="center"
            variant="h6"
            className={styles.pageTitle}
          >
            Oh je
          </Typography>
        </div>
        <div className={styles.textContainer}>
          <Typography
            align="center"
            variant="h6"
            className={styles.text}
          >
            Diese Seite ist nicht verfügbar.
          </Typography>
        </div>
        <div className={styles.textContainer}>
          <Button
            variant="outlined"
            onClick={onClickBack}
            color="inherit"
            className={styles.button}
          >
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default FourOFour
