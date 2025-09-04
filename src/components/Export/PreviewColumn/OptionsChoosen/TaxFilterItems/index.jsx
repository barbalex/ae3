import Item from './Item.jsx'

const ExportTaxFilterListItems = ({ taxFilters }) =>
  taxFilters.map((f) => <Item key={`${f.taxname}: ${f.pname}`} filter={f} />)

export default ExportTaxFilterListItems
