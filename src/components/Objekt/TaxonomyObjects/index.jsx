import { sortBy } from 'es-toolkit'

import { TaxonomyObject } from './TaxonomyObject/index.jsx'

export const TaxonomyObjects = ({ objects, stacked = false }) =>
  sortBy(objects, [
    (tO) => tO?.taxonomyByTaxonomyId?.name ?? '(Name fehlt)',
  ]).map((o) => (
    <TaxonomyObject
      key={o.id}
      objekt={o}
      showLink
      stacked={stacked}
    />
  ))
