import type { ChangeEvent } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useAtom } from 'jotai'

import { Taxonomies } from './Taxonomies'
import {
  exportTypeAtom,
  exportTaxonomiesAtom,
} from '../../../../../../store'
import { apiFetch } from '../../../../../../modules/api'
import { ErrorBoundary } from '../../../../../shared/ErrorBoundary'

import styles from './index.module.css'

const exportTypes = ['Arten', 'Lebensräume']
const exportTypeTAXToReadable: Record<string, string> = {
  ART: 'Arten',
  LEBENSRAUM: 'Lebensräume',
}

type ExportTypeProps = {
  type: string
}

export const ExportType = ({ type }: ExportTypeProps) => {
  const [exportType, setExportType] = useAtom(exportTypeAtom)
  const [exportTaxonomies, setExportTaxonomies] = useAtom(exportTaxonomiesAtom)

  const onCheckType = async (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    const { name } = event.target
    const taxonomies = await apiFetch(
      `/taxonomy?select=id,name,type&type=eq.${type === 'Arten' ? 'Art' : 'Lebensraum'}&order=name`,
    )
    if (isChecked) {
      setExportType(name)
      // check if only one Taxonomy exists
      // if so, check it
      if ((taxonomies ?? []).length === 1) {
        const taxonomyName = taxonomies[0]?.taxonomyName
        setExportTaxonomies([...exportTaxonomies, taxonomyName])
      }
      // check if taxonomy(s) of other type was chosen
      // if so: uncheck
      const exportTaxonomiesWithoutOtherType = exportTaxonomies.filter(
        (t) => exportTypeTAXToReadable[(t as any).type] === name,
      )
      if (exportTaxonomiesWithoutOtherType.length < exportTaxonomies.length) {
        setExportTaxonomies(exportTaxonomiesWithoutOtherType)
      }
    } else {
      setExportType(exportTypes.find((t) => t !== name) ?? null)
      // uncheck all taxonomies of this type
      const taxonomiesToUncheck = (taxonomies ?? []).map((t: any) => t.taxonomyName)
      const remainingTaxonomies = exportTaxonomies.filter(
        (t) => !taxonomiesToUncheck.includes(t),
      )
      setExportTaxonomies(remainingTaxonomies)
    }
  }

  return (
    <ErrorBoundary>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name={type}
              checked={exportType === type}
              onChange={onCheckType}
            />
          }
          label={type}
          className={styles.label}
        />
        {exportType === type && <Taxonomies type={type} />}
      </div>
    </ErrorBoundary>
  )
}
