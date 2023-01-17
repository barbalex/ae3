import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import storeContext from '../storeContext'
import PropertyCollection from './PropertyCollection'
import PCO from './PropertyCollection/PCO'
import RCO from './PropertyCollection/RCO'

const PcPcoOrRco = () => {
  const store = useContext(storeContext)
  const activeNodeArray = getSnapshot(store.activeNodeArray)

  const showPC =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 2
  const showPCO =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 3 &&
    activeNodeArray[2] === 'Eigenschaften'
  const showRCO =
    activeNodeArray[0] === 'Eigenschaften-Sammlungen' &&
    activeNodeArray[1] &&
    activeNodeArray.length === 3 &&
    activeNodeArray[2] === 'Beziehungen'

  return showPC ? (
    <PropertyCollection />
  ) : showPCO ? (
    <PCO />
  ) : showRCO ? (
    <RCO />
  ) : null
}

export default observer(PcPcoOrRco)
