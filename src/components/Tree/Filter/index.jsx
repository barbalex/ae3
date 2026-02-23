import { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Highlighter from 'react-highlight-words'
import Select from 'react-select/async'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { useNavigate } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { getUrlForObject } from '../../../modules/getUrlForObject.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { buildOptions } from './buildOptions.js'
import { constants } from '../../../modules/constants.js'
import {
  treeFilterIdAtom,
  setTreeFilterAtom,
  scrollIntoViewAtom,
} from '../../../store/index.ts'

import styles from './index.module.css'

const noOptionsMessage = () => null
const loadingMessage = () => null
// react-highlight-words crashes when passing some chars
const removeBadChars = (str) => str.replaceAll('(', '').replaceAll(')', '')
const formatOptionLabel = ({ label }, { inputValue }) => (
  <Highlighter
    searchWords={[removeBadChars(inputValue)]}
    textToHighlight={label}
  />
)
const formatGroupLabel = (data) => <div>{data.label}</div>

const objectUrlQuery = gql`
  query objectUrlDataQuery($treeFilterId: UUID!, $run: Boolean!) {
    objectById(id: $treeFilterId) @include(if: $run) {
      id
      objectByParentId {
        id
        objectByParentId {
          id
          objectByParentId {
            id
            objectByParentId {
              id
              objectByParentId {
                id
                objectByParentId {
                  id
                }
              }
            }
          }
        }
      }
      taxonomyByTaxonomyId {
        id
        type
        name
      }
    }
  }
`

const getCustomStyles = (singleColumnView) => ({
  control: (provided) => ({
    ...provided,
    border: 'none',
    borderRadius: '3px',
    backgroundColor: '#FFCC8042',
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
    color: 'rgba(0,0,0,0.8)',
  }),
  option: (provided) => ({
    ...provided,
    color: 'rgba(0,0,0,0.8)',
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
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '700',
    userSelect: 'none',
    textTransform: 'none',
  }),
  input: (provided) => ({
    ...provided,
    color: 'rgba(0, 0, 0, 0.8)',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: `calc(100vh - ${constants.appBarHeight}px - 39px)`,
    '::-webkit-scrollbar': {
      width: '6px',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '4px',
      boxShadow: 'inset 0 0 7px #e65100',
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
    color: 'rgba(0,0,0,0.4)',
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
    color: 'rgba(0,0,0,0.8)',
  }),
})

export const Filter = () => {
  // TODO: use local state instead of mobx for label, id
  const apolloClient = useApolloClient()

  const treeFilterId = useAtomValue(treeFilterIdAtom)
  const setTreeFilter = useSetAtom(setTreeFilterAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const navigate = useNavigate()

  const actualTreeFilterId =
    treeFilterId ?? '99999999-9999-9999-9999-999999999999'
  const { data: objectUrlData } = useQuery({
    queryKey: ['objectUrl', actualTreeFilterId],
    queryFn: () =>
      apolloClient.query({
        query: objectUrlQuery,
        variables: {
          treeFilterId: actualTreeFilterId,
          run: !!treeFilterId,
        },
      }),
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
    const urlObject = objectUrlData?.data?.objectById ?? {}
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
  }, [
    actualTreeFilterId,
    setTreeFilter,
    objectUrlData?.data?.objectById,
    navigate,
  ])

  const buildOptionsDebounced = useDebouncedCallback(({ cb, val }) => {
    buildOptions({
      client: apolloClient,
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
