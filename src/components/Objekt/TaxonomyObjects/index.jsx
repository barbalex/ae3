import { sortBy } from 'es-toolkit'

import { TaxonomyObject } from './TaxonomyObject/index.jsx'

export const TaxonomyObjects = ({ objects }) =>
  sortBy(objects, [
    (tO) => tO?.taxonomyByTaxonomyId?.name ?? '(Name fehlt)',
  ]).map((o) => (
    <TaxonomyObject
      key={o.id}
      objekt={o}
      showLink
    />
  ))
