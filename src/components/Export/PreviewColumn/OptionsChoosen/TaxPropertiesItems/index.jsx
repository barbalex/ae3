import Item from './Item.jsx'

const ExportTaxPropertiesListItems = ({ taxProperties }) => {
  return taxProperties.map((p) => (
    <Item key={`${p.taxname}: ${p.pname}`} properties={p} />
  ))
}

export default ExportTaxPropertiesListItems
