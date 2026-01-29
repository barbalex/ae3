import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { useAtomValue } from 'jotai'

import { MenuItem } from './MenuItem.jsx'
import { docFilterAtom } from '../../../store/index.ts'

import styles from './MenuItems.module.css'

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
    title: 'Fehler, Ideen, Vorschläge',
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

export const MenuItems = () => {
  const docFilter = useAtomValue(docFilterAtom)
  const nodesFiltered = nodes.filter(
    (node) => node.title?.toLowerCase?.()?.includes?.(docFilter) ?? true,
  )

  return (
    <List component="nav">
      <Divider className={styles.divider} />
      {nodesFiltered.map((node) => (
        <MenuItem
          node={node}
          key={node.slug}
        />
      ))}
    </List>
  )
}
