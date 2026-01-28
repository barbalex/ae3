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
  }
)

// ScrollIntoView atoms
export const scrollIntoViewCounterAtom = atom<number>(0)

export const scrollIntoViewAtom = atom(
  null,
  (get, set) => {
    set(scrollIntoViewCounterAtom, get(scrollIntoViewCounterAtom) + 1)
  }
)