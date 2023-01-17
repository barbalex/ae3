import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../storeContext'
import Taxonomy from './Taxonomy'
import Objekt from './Objekt'

const TaxonomyOrObject = () => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const showTaxonomy =
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0]) &&
    activeNodeArray.length === 1
  const showObjekt =
    ['Arten', 'Lebensräume'].includes(activeNodeArray[0]) &&
    activeNodeArray.length > 0

  return showTaxonomy ? <Taxonomy /> : showObjekt ? <Objekt /> : null
}

export default observer(TaxonomyOrObject)
