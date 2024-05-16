import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useLocation, useNavigate } from 'react-router-dom'

import storeContext from '../storeContext.js'
import getActiveNodeArrayFromPathname from '../modules/getActiveNodeArrayFromPathname.js'

const ActiveNodeArraySetter = () => {
  const store = useContext(storeContext)
  const { setActiveNodeArray } = store

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // console.log('ActiveNodeArraySetter', { pathname })

  useEffect(() => {
    // console.log('ActiveNodeArraySetter: setting activeNodeArray')
    setActiveNodeArray(getActiveNodeArrayFromPathname(), navigate)
  }, [navigate, pathname, setActiveNodeArray])
}

export default observer(ActiveNodeArraySetter)
