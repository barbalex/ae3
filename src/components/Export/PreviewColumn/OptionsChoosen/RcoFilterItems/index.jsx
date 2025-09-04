import Item from './Item.jsx'

const ExportRcoFilterListItems = ({ rcoFilters }) =>
  rcoFilters.map((f) => (
    <Item key={`${f.pcname}|${f.relationtype}|${f.pname}`} filter={f} />
  ))

export default ExportRcoFilterListItems
