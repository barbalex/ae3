import React, { useContext } from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import MenuItem from './MenuItem'
import storeContext from '../../../storeContext.js'

// dont know why but divider is too thick,
// thicker than ListItemButton divider
const StyledDivider = styled(Divider)`
  height: unset !important;
  background: unset !important;
`

const nodes = [
  {
    slug: 'projektbeschreibung',
    date: '2019-09-29',
    title: 'Projektbeschreibung',
    sort1: 1,
  },
  {
    slug: 'technische-voraussetzungen',
    date: '2019-09-29',
    title: 'Technische Voraussetzungen',
    sort1: 2,
  },
  {
    slug: 'fehler-melden',
    date: '2019-09-29',
    title: 'Fehler, Ideen, Vorschläge melden',
    sort1: 3,
  },
  {
    slug: 'neue-art-erfassen',
    date: '2021-11-02',
    title: 'Neue Art erfassen',
    sort1: 4,
  },
  {
    slug: 'schnittstellen',
    date: '2021-10-25',
    title: 'Schnittstellen',
    sort1: 5,
  },
]

const MenuItems = () => {
  const { docFilter } = useContext(storeContext)
  const nodesFiltered = nodes.filter(
    (node) => node.title?.toLowerCase?.()?.includes?.(docFilter) ?? true,
  )

  return (
    <List component="nav">
      <StyledDivider />
      {nodesFiltered.map((node) => (
        <MenuItem node={node} key={node.slug} />
      ))}
    </List>
  )
}

export default observer(MenuItems)
