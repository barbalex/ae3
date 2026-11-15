import { createContext, useContext } from 'react'
import { useSearchParams } from 'react-router'

import {
  openSectionsParamName,
  parseOpenSections,
  serializeOpenSections,
} from '../../modules/openSectionsUrl'

export type OpenSections = {
  // defaultOpen applies while there is no ?open= param or the section
  // has no id yet (data still loading)
  isSectionOpen: (id: string | undefined, defaultOpen: boolean) => boolean
  setSectionOpen: (id: string, defaultOpen: boolean, open: boolean) => void
}

export const OpenSectionsContext = createContext<OpenSections | null>(null)

/**
 * State of the collapsible sections of an Objekt page, kept in the ?open=
 * search param so a page with specific sections open is a shareable link.
 * defaultOpenIds are the ids of the sections that are open without a param;
 * the first toggle seeds the param with them so they stay open.
 */
export const useOpenSections = (
  defaultOpenIds: Array<string | undefined>,
): OpenSections => {
  const [searchParams, setSearchParams] = useSearchParams()
  const openIds = parseOpenSections(searchParams.get(openSectionsParamName))
  const defaults = defaultOpenIds.filter((id): id is string => id !== undefined)

  const isSectionOpen = (id: string | undefined, defaultOpen: boolean) =>
    openIds === null || id === undefined ? defaultOpen : openIds.has(id)

  const setSectionOpen = (id: string, defaultOpen: boolean, open: boolean) => {
    if (isSectionOpen(id, defaultOpen) === open) return
    const next = new Set(openIds ?? defaults)
    if (open) {
      next.add(id)
    } else {
      next.delete(id)
    }
    // when every tracked section is back at its default, drop the param
    const equalsDefaults =
      next.size === defaults.length &&
      [...next].every((sectionId) => defaults.includes(sectionId))
    const nextParams = new URLSearchParams(searchParams)
    if (equalsDefaults) {
      nextParams.delete(openSectionsParamName)
    } else {
      nextParams.set(openSectionsParamName, serializeOpenSections(next))
    }
    setSearchParams(nextParams, { replace: true })
  }

  return { isSectionOpen, setSectionOpen }
}

export const useOpenSectionsContext = () => useContext(OpenSectionsContext)
