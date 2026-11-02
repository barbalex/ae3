import { Relation } from './Relation'

import styles from './index.module.css'

type RelationListProps = {
  relations: any[]
}

export const RelationList = ({ relations }: RelationListProps) => {
  const relationsTitleText =
    relations.length > 1 ? 'Beziehungen:' : 'Beziehung:'
  const relationsTitle = `${relations.length} ${relationsTitleText}`

  return (
    <>
      <div className={styles.title}>{relationsTitle}</div>
      {relations.map((relation, index) => (
        <Relation
          key={relation.id}
          relation={relation}
          intermediateRelation={index < relations.length - 1}
        />
      ))}
    </>
  )
}
