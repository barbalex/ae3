/**
 * TODO editing
 * if user is logged in and is orgAdmin or orgTaxonomyWriter
 * and object is not synonym
 * show editing symbol
 * if user clicks it, toggle store > editingTaxonomies
 * edit prop: see https://stackoverflow.com/a/35349699/712005
 */
import { useAtomValue } from 'jotai'

import { PropertyList } from './PropertyList'
import { NewProperty } from '../../../../shared/NewProperty'
import {
  stackedAtom,
  editingTaxonomiesAtom,
} from '../../../../../store'

import styles from './index.module.css'

type PropertiesProps = {
  id: string
  properties: any
  refetch?: () => void
}

const Properties = ({ id, properties, refetch }: PropertiesProps) => {
  const editingTaxonomies = useAtomValue(editingTaxonomiesAtom)
  const stacked = useAtomValue(stackedAtom)

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
}

export default Properties
