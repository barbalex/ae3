import { lazy } from 'react'

// The tree pulls react-select, virtua and the row machinery — a large slice
// of the bundle that the first paint does not need. Loading it lazily keeps
// those chunks from competing with the routed page and the LCP image for
// bandwidth; the tree itself still starts loading immediately after the
// layout has rendered.
export const LazyTree = lazy(async () => ({
  default: (await import('../Tree/index')).Tree,
}))
