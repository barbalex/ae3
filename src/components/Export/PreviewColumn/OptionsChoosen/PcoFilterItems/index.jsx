import Item from './Item.jsx'

const PcoFilterItems = ({ pcoFilters }) =>
  pcoFilters.map((f) => <Item key={`${f.pcname}: ${f.pname}`} filter={f} />)

export default PcoFilterItems
