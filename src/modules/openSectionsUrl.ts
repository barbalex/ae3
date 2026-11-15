// search-param codec for the open sections of an Objekt page: a comma
// separated list of section ids — the object id for taxonomy cards,
// `<objId>/<pcId>` for property collection cards. Ids are UUIDs, so commas
// cannot appear inside them.
// An absent param means "every section uses its default"; a present but
// empty value means "all sections closed".

export const openSectionsParamName = 'open'

// null = param absent (defaults apply), a set (possibly empty) = override
export const parseOpenSections = (param: string | null): Set<string> | null =>
  param === null ? null : new Set(param.split(',').filter(Boolean))

export const serializeOpenSections = (ids: Iterable<string>): string =>
  [...ids].join(',')
