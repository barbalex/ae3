/**
 * TODO editing
 * if user is logged in and is orgAdmin or orgTaxonomyWriter
 * and object is not synonym
 * show editing symbol
 * if user clicks it, toggle store > editingTaxonomies
 * edit prop: see https://stackoverflow.com/a/35349699/712005
 */
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { PropertyList } from './PropertyList.jsx'
import { NewProperty } from '../../../../shared/NewProperty.jsx'
import { storeContext } from '../../../../../storeContext.js'

import {
  titleContainer,
  titleLabel,
  titleLabelEditing,
  titleLabelStacked,
  titleValue,
} from './index.module.css'

const Properties = observer(({ id, properties, stacked }) => {
  const store = useContext(storeContext)
  const { editingTaxonomies } = store

  const propertiesArray = Object.entries(properties)

  return (
    <>
      {propertiesArray.length > 0 && (
        <div className={titleContainer}>
          {editingTaxonomies ?
            <p className={titleLabelEditing}>Eigenschaften:</p>
          : stacked ?
            <p className={titleLabelStacked}>Eigenschaften:</p>
          : <p className={titleLabel}>Eigenschaften:</p>}
          <p className={titleValue} />
        </div>
      )}
      <PropertyList
        propertiesArray={propertiesArray}
        properties={properties}
        editing={editingTaxonomies}
        stacked={stacked}
        id={id}
      />
      {editingTaxonomies && (
        <NewProperty
          key={`${id}/newProperty`}
          id={id}
          properties={properties}
        />
      )}
    </>
  )
})

export default Properties
