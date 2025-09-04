import Taxonomy from './Taxonomy/index.jsx'

const Taxonomies = ({ taxonomies, initiallyExpanded }) =>
  taxonomies.map((tax) => (
    <Taxonomy key={tax} tax={tax} initiallyExpanded={initiallyExpanded} />
  ))

export default Taxonomies
