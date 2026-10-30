import { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Highlighter from 'react-highlight-words'
import Select from 'react-select/async'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useNavigate } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { getUrlForObject } from '../../../modules/getUrlForObject.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { buildOptions } from './buildOptions.js'
import { constants } from '../../../modules/constants.js'
import { apiFetch, rpc } from '../../../modules/api.js'
import { attachParentIds } from '../../../modules/attachParentChain.js'
import {
  treeFilterIdAtom,
  setTreeFilterAtom,
  scrollIntoViewAtom,
} from '../../../store/index.ts'

import styles from './index.module.css'

const noOptionsMessage = () => null
const loadingMessage = () => null
const formatOptionLabel = ({ label }, { inputValue }) => (
  <Highlighter
    searchWords={[inputValue]}
    textToHighlight={label}
  />
)
const formatGroupLabel = (data) => <div>{data.label}</div>

// fetch the object and its ancestor path in two parallel requests
// (formerly a recursive graphql query, then one request per parent)
const getObjectForUrl = async (id) => {
  const [current, path] = await Promise.all([
    apiFetch(
      `/object?id=eq.${id}&select=id,taxonomyByTaxonomyId:taxonomy_id(id,type)&limit=1`,
    ),
    rpc('object_path', { p_object_id: id }),
  ])
  if (!current?.[0]) return null
  const rootFirst = path.map((row) => row.object_id)
  return attachParentIds(current[0], rootFirst.slice(0, -1).reverse())
}

const getCustomStyles = (singleColumnView) => ({
  control: (provided) => ({
    ...provided,
    border: 'none',
    borderRadius: '3px',
    backgroundColor: 'var(--ae-bg-highlight-soft)',
    marginLeft: 0,
    paddingLeft: singleColumnView ? '2px' : '25px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    borderRadius: '3px',
    paddingLeft: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--ae-text-strong)',
  }),
  option: (provided) => ({
    ...provided,
    color: 'var(--ae-text-strong)',
    fontSize: '0.8em',
    paddingTop: '5px',
    paddingBottom: '5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  groupHeading: (provided) => ({
    ...provided,
    lineHeight: '1em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'var(--ae-text-strong)',
    fontWeight: '700',
    userSelect: 'none',
    textTransform: 'none',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--ae-text-strong)',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '4px',
      boxShadow: 'inset 0 0 7px var(--ae-tab-selected)',
      background: 'rgba(85, 85, 85, 0.05)',
    },
    '::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0) !important',
      borderRadius: '1rem',
    },
    // '::-webkit-scrollbar-thumb:hover': {
    //   background: '#6B2500',
    // },
  }),
  menu: (provided) => ({
    ...provided,
    width: 'auto',
    maxWidth: '100%',
    marginTop: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--ae-text-soft)',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'var(--ae-text-strong)',
  }),
})

export const Filter = () => {
  // TODO: use local state instead of mobx for label, id
  const treeFilterId = useAtomValue(treeFilterIdAtom)
  const setTreeFilter = useSetAtom(setTreeFilterAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const navigate = useNavigate()

  const actualTreeFilterId =
    treeFilterId ?? '99999999-9999-9999-9999-999999999999'
  const { data: objectUrlData } = useQuery({
    queryKey: ['objectUrl', actualTreeFilterId],
    queryFn: () => getObjectForUrl(actualTreeFilterId),
    enabled: !!treeFilterId,
  })

  const onInputChange = (value, { action }) => {
    if (action !== 'input-change') return
    setTreeFilter({ text: value, id: null })
  }

  const onChange = (option) => {
    if (!option) return
    switch (option.type) {
      case 'pC':
        navigate(`/Eigenschaften-Sammlungen/${option.val}`)
        setTimeout(() => scrollIntoView())
        break
      case 'art':
      case 'lr':
      default: {
        /**
         * set treeFilterId
         * then app rerenders
         * effect finds treeFilterId
         * and result of objectUrlData query
         * passes it to getUrlForObject
         * mutates history
         */
        setTreeFilter({ id: option.val, text: option.label })
        setTimeout(() => scrollIntoView())
      }
    }
    // TODO: refetch query
  }

  useEffect(() => {
    const urlObject = objectUrlData ?? {}
    /**
     * check if treeFilterId and urlObject exist
     * if true:
     * pass query result for objectUrlData to getUrlForObject()
     * then update history with that result
     * and reset treeFilter, id and text
     */
    if (
      actualTreeFilterId &&
      actualTreeFilterId !== '99999999-9999-9999-9999-999999999999' &&
      urlObject &&
      urlObject.id
    ) {
      const url = getUrlForObject(urlObject)
      navigate(`/${url.join('/')}`)
      setTimeout(() => scrollIntoView())
      setTreeFilter({ id: null, text: '' })
    }
  }, [actualTreeFilterId, setTreeFilter, objectUrlData, navigate])

  const buildOptionsDebounced = useDebouncedCallback(({ cb, val }) => {
    buildOptions({
      cb,
      val,
    })
  }, 600)

  const loadOptions = (val, cb) => buildOptionsDebounced({ cb, val })

  // TODO: replace with real value
  const singleColumnView = false

  const customStyles = getCustomStyles(singleColumnView)

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FaSearch className={styles.searchIcon} />
        <Select
          aria-label="treeFilter"
          styles={customStyles}
          onInputChange={onInputChange}
          onChange={onChange}
          formatGroupLabel={formatGroupLabel}
          formatOptionLabel={formatOptionLabel}
          placeholder="suchen"
          noOptionsMessage={noOptionsMessage}
          loadingMessage={loadingMessage}
          classNamePrefix="react-select"
          loadOptions={loadOptions}
          isClearable
          spellCheck={false}
          className={`pad-left-25 ${styles.select}`}
          // ensure the menu always is on top
          menuPortalTarget={document.body}
        />
      </div>
    </ErrorBoundary>
  )
}
