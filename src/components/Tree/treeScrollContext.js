import { createContext, useContext } from 'react'

// lets IntoViewScroller scroll to rows that virtualization keeps
// unmounted: VirtualizedTree provides a function resolving a row id
// to its index and scrolling it into view
const TreeScrollContext = createContext(null)

export const TreeScrollProvider = TreeScrollContext.Provider

export const useTreeScroll = () => useContext(TreeScrollContext)
