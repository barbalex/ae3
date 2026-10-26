import { atom } from 'jotai'

// state of the open tree context menu; null when closed.
// id increments per opening; used to remount the menu (resetting state)
export const treeContextMenuAtom = atom(null)

// ms a left mouse button / touch has to be held down on a row to open the menu
export const holdToDisplayMs = 1000

let menuOpenCount = 0
export const nextMenuOpenId = () => ++menuOpenCount
