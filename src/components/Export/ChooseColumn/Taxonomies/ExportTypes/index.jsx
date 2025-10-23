import { ExportType } from './ExportType/index.jsx'

const exportTypes = ['Arten', 'Lebensräume']

export const ExportTypes = () =>
  exportTypes.map((type) => (
    <ExportType
      key={type}
      type={type}
    />
  ))
