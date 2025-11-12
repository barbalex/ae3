import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { MdLink as LinkIcon } from 'react-icons/md'

import { button, linkIcon } from './LinkMenu.module.css'

const ITEM_HEIGHT = 48

const paperProps = {
  style: {
    maxHeight: ITEM_HEIGHT * 4.5,
    width: 200,
  },
}

const LinkMenu = ({ objekt }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const props = objekt?.properties ? JSON.parse(objekt?.properties) : null
  const nameDeutsch = props?.['Name Deutsch'] ?? null
  const einheit = props?.Einheit ?? null
  const gattung = props?.Gattung
  const art = props?.Art
  const taxName = objekt?.taxonomyByTaxonomyId?.name
  const isSisf2 = taxName?.toLowerCase?.().includes?.('sisf')
  const isDbTaxref = taxName?.toLowerCase?.().includes?.('db-taxref')

  const onClickIcon = (e) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const onClickGoogleImages = (e) => {
    e.stopPropagation()
    const url =
      einheit ?
        `https://www.google.ch/search?tbm=isch&q=${einheit}`
      : `https://www.google.ch/search?tbm=isch&q="${objekt?.name}"${
          nameDeutsch ? `+OR+"${nameDeutsch}"` : ''
        }`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }
  const onClickWikepedia = (e) => {
    e.stopPropagation()
    const url =
      einheit ? `https://www.google.ch/search?q=${einheit} site:wikipedia.org`
      : nameDeutsch ?
        `https://www.google.ch/search?q="${nameDeutsch}"+OR+"${objekt?.name}" site:wikipedia.org`
      : `https://www.google.ch/search?q="${objekt?.name}" site:wikipedia.org`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }
  const onClickGbifFromSisf2 = (e) => {
    e.stopPropagation()
    const url = `https://www.gbif.org/species/search?q=${encodeURIComponent(
      `${gattung} ${art}`,
    )}`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }
  const onClickGbifFromDbTaxref = (e) => {
    e.stopPropagation()
    const url = `https://www.gbif.org/species/search?q=${encodeURIComponent(
      `${props?.['Artname vollständig']}`,
    )}`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }
  const onClickSisf2 = (e) => {
    e.stopPropagation()
    const url = `https://www.infoflora.ch/de/flora/${`${gattung?.toLowerCase?.()}-${art?.toLowerCase?.()}.html`}`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }
  const onClickDbTaxref = (e) => {
    e.stopPropagation()
    const url = `https://www.infoflora.ch/de/flora/${props?.['Taxonomie ID intern']}`
    typeof window !== 'undefined' && window.open(url)
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-label="Externe Links"
        title="Externe Links"
        aria-owns={anchorEl ? 'menu' : null}
        aria-haspopup="true"
        onClick={onClickIcon}
        color="inherit"
        className={button}
      >
        <LinkIcon className={linkIcon} />
      </Button>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={paperProps}
      >
        <MenuItem
          key="googleBilder"
          onClick={onClickGoogleImages}
        >
          Bilder googeln
        </MenuItem>
        <MenuItem
          key="wikipedia"
          onClick={onClickWikepedia}
        >
          Wikipedia-Artikel suchen
        </MenuItem>
        {isSisf2 && gattung && art && (
          <MenuItem
            key="gbif"
            onClick={onClickGbifFromSisf2}
          >
            Im GBIF suchen
          </MenuItem>
        )}
        {isDbTaxref && props?.['Artname vollständig'] && (
          <MenuItem
            key="gbif"
            onClick={onClickGbifFromDbTaxref}
          >
            Im GBIF suchen
          </MenuItem>
        )}
        {isSisf2 && gattung && art && (
          <MenuItem
            key="infoflora"
            onClick={onClickSisf2}
          >
            Bei Info Flora suchen
          </MenuItem>
        )}
        {isDbTaxref && props?.['Taxonomie ID intern'] && (
          <MenuItem
            key="db-taxref"
            onClick={onClickDbTaxref}
          >
            Bei Info Flora suchen
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default LinkMenu
