import ExportType from './ExportType/index.jsx'

const exportTypes = ['Arten', 'Lebensräume']

const ExportTypes = () =>
  exportTypes.map((type) => <ExportType key={type} type={type} />)

export default ExportTypes
