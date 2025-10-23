import { Taxonomy } from './Taxonomy/index.jsx'

export const TaxonomiesList = ({ taxonomies, initiallyExpanded }) =>
  taxonomies.map((tax) => (
    <Taxonomy
      key={tax}
      tax={tax}
      initiallyExpanded={initiallyExpanded}
    />
  ))
