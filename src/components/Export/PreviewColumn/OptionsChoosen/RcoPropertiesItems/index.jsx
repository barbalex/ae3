import Item from './Item.jsx'

const ExportRcoPropertiesListItems = ({ rcoProperties }) =>
  rcoProperties.map((p) => (
    <Item key={`${p.pcname}|${p.relationtype}|${p.pname}`} properties={p} />
  ))

export default ExportRcoPropertiesListItems
