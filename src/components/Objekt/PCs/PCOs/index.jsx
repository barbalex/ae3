import React from 'react'
import sortBy from 'lodash/sortBy'

import PCO from './PCO/index.jsx'

const PCOs = ({ pCs, pCOs, relations, stacked }) =>
  sortBy(pCs, (pC) => pC?.name ?? '(Name fehlt)').map((pC) => (
    <PCO
      key={pC.id}
      pC={pC}
      relations={relations.filter(
        (r) => r.propertyCollectionId === pC.propertyCollectionId,
      )}
      stacked={stacked}
    />
  ))

export default PCOs
