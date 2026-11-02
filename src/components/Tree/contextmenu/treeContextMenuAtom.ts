import { atom } from 'jotai'

import type { TreeNode } from '../treeModel'

// state of the open tree context menu; null when closed.
// id increments per opening; used to remount the menu (resetting state)
export type TreeContextMenuState = {
  id: number
  node: TreeNode
  x: number
  y: number
}
export const treeContextMenuAtom = atom<TreeContextMenuState | null>(null)

// ms a left mouse button / touch has to be held down on a row to open the menu
export const holdToDisplayMs = 1000

let menuOpenCount = 0
export const nextMenuOpenId = () => ++menuOpenCount
