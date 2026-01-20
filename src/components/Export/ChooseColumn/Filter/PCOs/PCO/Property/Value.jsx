import { useState, useContext, useRef } from 'react'
import Select from 'react-select/async'
import Highlighter from 'react-highlight-words'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'

import { readableType } from '../../../../../../../modules/readableType.js'
import { storeContext } from '../../../../../../../storeContext.js'

import styles from './Value.module.css'

const pcoFieldPropQuery = gql`
  query propDataQuery(
    $tableName: String!
    $propName: String!
    $pcFieldName: String!
    $pcTableName: String!
    $pcName: String!
    $propValue: String!
  ) {
    propValuesFilteredFunction(
      tableName: $tableName
      propName: $propName
      pcFieldName: $pcFieldName
      pcTableName: $pcTableName
      pcName: $pcName
      propValue: $propValue
    ) {
      nodes {
        value
      }
    }
  }
`

const noOptionsMessage = () => 'Keine Daten entsprechen dem Filter'
const loadingMessage = () => 'lade...'
// react-highlight-words crashes when passing some chars
const removeBadChars = (str) => str.replaceAll('(', '').replaceAll(')', '')
const formatOptionLabel = ({ label }, { inputValue }) => (
  <Highlighter
    searchWords={[removeBadChars(inputValue)]}
    textToHighlight={label}
  />
)

export const PcoValue = observer(
  ({ pcname, pname, jsontype, comparator, value: propsValue }) => {
    const apolloClient = useApolloClient()
    const store = useContext(storeContext)
    const { addFilterFields, setPcoFilter, addPcoProperty } = store.export

    // Problem with loading data
    // Want to load all data when user focuses on input
    // But is not possible to programmatically call loadOptions (https://github.com/JedWatson/react-select/discussions/5389#discussioncomment-3911824)
    // So need to set key on Select and update it on focus
    // Maybe better to not use AsyncSelect? https://github.com/JedWatson/react-select/discussions/5389#discussioncomment-3911837
    const ref = useRef()
    const [focusCount, setFocusCount] = useState(0)

    const [value, setValue] = useState(propsValue ?? '')
    const [error, setError] = useState(undefined)

    const loadOptions = async (val) => {
      if (!focusCount) return []
      const { data, error } = await apolloClient.query({
        query: pcoFieldPropQuery,
        variables: {
          tableName: 'property_collection_object',
          propName: pname,
          pcFieldName: 'property_collection_id',
          pcTableName: 'property_collection',
          pcName: pcname,
          propValue: val ?? '',
        },
      })
      const returnData = data?.propValuesFilteredFunction?.nodes?.map((n) => ({
        value: n.value,
        label: n.value,
      }))
      setValue(val)
      setError(error)
      return returnData
    }

    const setFilter = (val) => {
      // 1. change filter value
      let comparatorValue = comparator
      if (!comparator && val) comparatorValue = 'ILIKE'
      if (!val) comparatorValue = null
      setPcoFilter({
        pcname,
        pname,
        comparator: comparatorValue,
        value: val,
      })
      // 2. if value and field not chosen, choose it
      if (addFilterFields && val) {
        addPcoProperty({ pcname, pname })
      }
    }

    const onBlur = () => setFilter(value)

    const onChange = (newValue, actionMeta) => {
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
      <div className={styles.container}>
        <div
          className={styles.labelClass}
        >{`${pname} (${readableType(jsontype)})`}</div>
        <Select
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
                ref.current.onMenuOpen()
                ref.current.focus()
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
          spellCheck={false}
          // ensure the menu always is on top
          menuPortalTarget={document.body}
          className={styles.select}
        />
      </div>
    )
  },
)
