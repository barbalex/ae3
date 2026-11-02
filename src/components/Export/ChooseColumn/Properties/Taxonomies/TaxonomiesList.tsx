import { Taxonomy } from './Taxonomy'

type TaxonomiesListProps = {
  taxonomies: string[]
  initiallyExpanded: boolean
}

export const TaxonomiesList = ({
  taxonomies,
  initiallyExpanded,
}: TaxonomiesListProps) =>
  taxonomies.map((tax) => (
    <Taxonomy
      key={tax}
      tax={tax}
      initiallyExpanded={initiallyExpanded}
    />
  ))
