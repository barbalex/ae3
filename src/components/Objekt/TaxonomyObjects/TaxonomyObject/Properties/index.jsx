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

import styles from './index.module.css'

const Properties = observer(({ id, properties, refetch }) => {
  const store = useContext(storeContext)
  const { editingTaxonomies, stacked } = store

  const propertiesArray = Object.entries(properties)

  return (
    <>
      {propertiesArray.length > 0 && (
        <div className={styles.titleContainer}>
          {editingTaxonomies ?
            <p className={styles.titleLabelEditing}>Eigenschaften:</p>
          : stacked ?
            <p className={styles.titleLabelStacked}>Eigenschaften:</p>
          : <p className={styles.titleLabel}>Eigenschaften:</p>}
          <p className={styles.titleValue} />
        </div>
      )}
      <PropertyList
        propertiesArray={propertiesArray}
        properties={properties}
        editing={editingTaxonomies}
        id={id}
        refetch={refetch}
      />
      {editingTaxonomies && (
        <NewProperty
          key={`${id}/newProperty`}
          id={id}
          properties={properties}
          refetch={refetch}
        />
      )}
    </>
  )
})

export default Properties
