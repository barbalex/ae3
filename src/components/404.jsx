import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router'

import { ErrorBoundary } from './shared/ErrorBoundary.jsx'
import {
  container,
  textContainer,
  pageTitle,
  text,
  button,
} from './404.module.css'

const FourOFour = () => {
  const navigate = useNavigate()
  const onClickBack = () => navigate('/')

  return (
    <ErrorBoundary>
      <div className={container}>
        <div className={textContainer}>
          <Typography
            align="center"
            variant="h6"
            className={pageTitle}
          >
            Oh je
          </Typography>
        </div>
        <div className={textContainer}>
          <Typography
            align="center"
            variant="h6"
            className={text}
          >
            Diese Seite ist nicht verfügbar.
          </Typography>
        </div>
        <div className={textContainer}>
          <Button
            variant="outlined"
            onClick={onClickBack}
            color="inherit"
            className={button}
          >
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default FourOFour
