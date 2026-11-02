import { ExportType } from './ExportType'

const exportTypes = ['Arten', 'Lebensräume']

export const ExportTypes = () =>
  exportTypes.map((type) => (
    <ExportType
      key={type}
      type={type}
    />
  ))
