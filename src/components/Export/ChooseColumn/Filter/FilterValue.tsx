import { useState, useRef } from 'react'
import Select from 'react-select/async'
import Highlighter from 'react-highlight-words'
import type { SelectInstance, FormatOptionLabelMeta, ActionMeta } from 'react-select'
import { useSetAtom, useAtomValue } from 'jotai'
import type { PrimitiveAtom } from 'jotai'

import { readableType } from '../../../../modules/readableType'
import { rpc } from '../../../../modules/api'
import { ErrorBoundary } from '../../../shared/ErrorBoundary'
import { exportAddFilterFieldsAtom, exportPcoPropertiesAtom, exportRcoPropertiesAtom } from '../../../../store'
import { constants } from '../../../../modules/constants'

import styles from './FilterValue.module.css'

type Option = { value: any; label: any }

const noOptionsMessage = () => 'Keine Daten entsprechen dem Filter'
const loadingMessage = () => 'lade...'
const formatOptionLabel = (
  { label }: Option,
  { inputValue }: FormatOptionLabelMeta<Option>,
) => (
  <Highlighter
    searchWords={[inputValue]}
    textToHighlight={label}
  />
)

export type FilterValueProps = {
  // identifies the field being filtered; every entry must match a
  // filter entry, e.g. { taxname, pname } or { pcname, relationtype, pname }
  fieldId: Record<string, any>
  pname: string
  jsontype: string
  comparator: string | null
  value: string | number | null
  // rpc args identifying the table and collection to load values from
  rpcArgs: {
    table_name: string
    pc_field_name: string
    pc_table_name: string
    pc_name: string
  }
  filtersAtom: PrimitiveAtom<any[]>
  // atom of the chosen columns for the same kind
  propertiesAtom: PrimitiveAtom<any[]>
  // tax fields only respect the max export fields limit
  checkMaxFields?: boolean
}

export const FilterValue = ({
  fieldId,
  pname,
  jsontype,
  comparator,
  value: propsValue,
  rpcArgs,
  filtersAtom,
  propertiesAtom,
  checkMaxFields,
}: FilterValueProps) => {
  const filters = useAtomValue(filtersAtom)
  const setFilters = useSetAtom(filtersAtom)
  const properties = useAtomValue(propertiesAtom)
  const setProperties = useSetAtom(propertiesAtom)
  const addFilterFields = useAtomValue(exportAddFilterFieldsAtom)
  // only read for the maxFields check of tax fields
  const pcoProperties = useAtomValue(exportPcoPropertiesAtom)
  const rcoProperties = useAtomValue(exportRcoPropertiesAtom)

  // Problem with loading data
  // Want to load all data when user focuses on input
  // But is not possible to programmatically call loadOptions (https://github.com/JedWatson/react-select/discussions/5389#discussioncomment-3911824)
  // So need to set key on Select and update it on focus
  // Maybe better to not use AsyncSelect? https://github.com/JedWatson/react-select/discussions/5389#discussioncomment-3911837
  const ref = useRef<SelectInstance<Option>>(null)
  const [focusCount, setFocusCount] = useState(0)

  const [value, setValue] = useState(propsValue ?? '')
  const [error, setError] = useState<Error | undefined>(undefined)

  const isField = (f: any) =>
    Object.entries(fieldId).every(([key, val]) => f[key] === val)

  const loadOptions = async (val: string) => {
    if (!focusCount) return []
    let rows
    try {
      rows = await rpc('prop_values_filtered_function', {
        ...rpcArgs,
        prop_name: pname,
        prop_value: val ?? '',
      })
    } catch (err) {
      setError(err)
      setValue(val)
      return []
    }
    const returnData = rows?.map((n: any) => ({
      value: n.value,
      label: n.value,
    }))
    setValue(val)
    return returnData
  }

  const setFilter = (val: string | number) => {
    // 1. change filter value
    let comparatorValue = comparator
    if (!comparator && val) comparatorValue = 'ILIKE'
    if (!val) comparatorValue = null
    const filter = filters.find(isField)
    if (!comparatorValue && !val && val !== 0) {
      // remove
      setFilters(filters.filter((f) => !isField(f)))
    } else if (!filter) {
      // add new one
      setFilters([...filters, { ...fieldId, comparator: comparatorValue, value: val }])
    } else {
      // edit = add new one instead of existing
      setFilters([
        ...filters.filter((f) => !isField(f)),
        { ...fieldId, comparator: comparatorValue, value: val },
      ])
    }
    // 2. if value and field not chosen, choose it
    if (addFilterFields && val) {
      if (checkMaxFields) {
        // Check total properties count
        const nrOfPropertiesExported =
          properties.length +
          (rcoProperties?.length || 0) +
          (pcoProperties?.length || 0)
        if (nrOfPropertiesExported > constants.export.maxFields) return
      }
      // Only add if not yet done
      if (!properties.find(isField)) {
        setProperties([...properties, { ...fieldId }])
      }
    }
  }

  const onBlur = () => setFilter(value)

  const onChange = (newValue: any, actionMeta: ActionMeta<Option>) => {
    let value
    switch (actionMeta.action) {
      case 'clear':
        value = ''
        break
      default:
        value = newValue?.value
        break
    }
    setValue(value)
    setFilter(value)
  }

  if (error) {
    return `Error loading data: ${error.message}`
  }

  const valueToShow = value ? { value, label: value } : undefined

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div
          className={styles.label}
        >{`${pname} (${readableType(jsontype)})`}
        </div>
        <Select<Option>
          key={focusCount}
          ref={ref}
          value={valueToShow}
          defaultOptions={true}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => {
            if (focusCount === 0) {
              setFocusCount(1)
              setTimeout(() => {
                ref.current!.onMenuOpen()
                ref.current!.focus()
              })
            }
          }}
          formatOptionLabel={formatOptionLabel}
          placeholder={''}
          noOptionsMessage={noOptionsMessage}
          loadingMessage={loadingMessage}
          classNamePrefix="react-select"
          loadOptions={loadOptions}
          cacheOptions
          isClearable
          openMenuOnFocus={true}
          {...{ spellCheck: false }}
          // ensure the menu always is on top
          menuPortalTarget={document.body}
          className={styles.select}
        />
      </div>
    </ErrorBoundary>
  )
}
