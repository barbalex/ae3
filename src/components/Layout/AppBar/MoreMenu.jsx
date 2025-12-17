import { useState } from 'react'
import Icon from '@mui/material/Icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { MdMoreVert as MoreVertIcon } from 'react-icons/md'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router'

import relations from '../../../modules/relations.png'
import { moreVertIcon, button, version } from './MoreMenu.module.css'

// https://mui.com/material-ui/react-menu/#customization
const StyledButton = styled((props) => <Button {...props} />)(() => ({
  '& .MuiButton-root': {
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
  },
}))

const ITEM_HEIGHT = 48
const paperProps = { style: { maxHeight: ITEM_HEIGHT * 7 } }

export const MoreMenu = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const onClickButton = (event) => setAnchorEl(event.currentTarget)
  const onClose = () => setAnchorEl(null)
  const onClickUeber = () => {
    navigate('/Dokumentation/projektbeschreibung')
    setAnchorEl(null)
  }
  const onClickStruktur = () => {
    setAnchorEl(null)
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(relations, '_blank', 'toolbar=no')
      }
      window.open(relations)
    }
  }
  const onClickMelden = () => {
    typeof window !== 'undefined' &&
      window.open('https://github.com/barbalex/ae3/issues')
    setAnchorEl(null)
  }
  // const onClickGqlQuery = () => {
  //   navigate('/graphiql')
  //   setAnchorEl(null)
  // }
  const hostname =
    typeof window !== 'undefined' ? window.location.hostname : 'artdaten.ch'
  const onClickUptime = () => {
    if (typeof window === 'undefined') return

    const hostname = window.location.hostname
    const uptimeUrl =
      hostname === 'localhost' ?
        'https://uptime.artdaten.ch'
      : `//uptime.${hostname.replace('www.', '')}`
    window.open(uptimeUrl)
    setAnchorEl(null)
  }

  return (
    <div>
      <StyledButton
        aria-label="More"
        aria-owns={anchorEl ? 'long-menu' : null}
        aria-haspopup="true"
        onClick={onClickButton}
        title="Mehr..."
        className={button}
        color="inherit"
      >
        <Icon>
          <MoreVertIcon className={moreVertIcon} />
        </Icon>
      </StyledButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={paperProps}
      >
        <MenuItem
          key="ueber"
          onClick={onClickUeber}
        >
          über arteigenschaften.ch
        </MenuItem>
        <MenuItem
          key="relations"
          onClick={onClickStruktur}
        >
          Daten-Struktur
        </MenuItem>
        <MenuItem
          key="melden"
          onClick={onClickMelden}
        >
          Fehler oder Wünsche melden
        </MenuItem>
        <MenuItem onClick={onClickUptime}>
          {`Verfügbarkeit der Server von ${hostname}`}
        </MenuItem>
        <div className={version}>Version: 3.1.41 vom 17.12.2025</div>
      </Menu>
    </div>
  )
}
