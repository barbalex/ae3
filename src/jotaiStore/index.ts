import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const jotaiStore = createStore()

// TreeFilter atoms
export const treeFilterTextAtom = atom<string>('')
export const treeFilterIdAtom = atom<string | null>(null)

export const setTreeFilterAtom = atom(
  null,
  (get, set, { id, text }: { id: string | null; text: string }) => {
    set(treeFilterTextAtom, text)
    set(treeFilterIdAtom, id)
  },
)

// ScrollIntoView atoms
export const scrollIntoViewCounterAtom = atom<number>(0)

export const scrollIntoViewAtom = atom(null, (get, set) => {
  set(scrollIntoViewCounterAtom, get(scrollIntoViewCounterAtom) + 1)
})

// Login atoms
export const loginTokenAtom = atom<string | null>(null)
export const loginUsernameAtom = atom<string | null>(null)

export const setLoginAtom = atom(
  null,
  (
    get,
    set,
    { username, token }: { username: string | null; token: string | null },
  ) => {
    set(loginUsernameAtom, username)
    set(loginTokenAtom, token)
  },
)

// Stacked atom
export const stackedAtom = atom<boolean>(false)

// Window dimensions atoms
export const windowWidthAtom = atom<number>(800)
export const windowHeightAtom = atom<number>(800)

// Derived atom for single column view
export const singleColumnViewAtom = atom<boolean>(
  (get) => get(windowWidthAtom) <= 700,
)

// DocFilter atom
export const docFilterAtom = atom<string | number>('')

// SidebarWidth atom
export const sidebarWidthAtom = atom<number | null>(null)

// Editing states
export const editingPCsAtom = atom<boolean>(false)
export const editingTaxonomiesAtom = atom<boolean>(false)

// Active node array atom
export const activeNodeArrayAtom = atom<(string | number)[]>([])
