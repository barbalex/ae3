import { sortBy } from 'es-toolkit'

import { TaxonomyObject } from './TaxonomyObject'

type TaxonomyObjectsProps = {
  objects: any[]
}

export const TaxonomyObjects = ({ objects }: TaxonomyObjectsProps) =>
  sortBy(objects, [
    (tO) => tO?.taxonomyByTaxonomyId?.name ?? '(Name fehlt)',
  ]).map((o) => (
    <TaxonomyObject
      key={o.id}
      objekt={o}
      showLink
    />
  ))
