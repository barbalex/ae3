import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSetAtom } from 'jotai'
import { isEqual } from 'es-toolkit'

import { getActiveNodeArrayFromPathname } from '../modules/getActiveNodeArrayFromPathname.js'
import {
  activeNodeArrayAtom,
  scrollIntoViewAtom,
} from '../store/index.ts'

const ActiveNodeArraySetter = () => {
  const setActiveNodeArray = useSetAtom(activeNodeArrayAtom)
  const scrollIntoView = useSetAtom(scrollIntoViewAtom)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // console.log('ActiveNodeArraySetter', { pathname })

  useEffect(() => {
    // console.log('ActiveNodeArraySetter: setting activeNodeArray')
    const value = getActiveNodeArrayFromPathname()
    setActiveNodeArray(value)
    const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
    if (!isEqual(activeNodeArrayFromUrl, value) && navigate) {
      navigate(`/${value.join('/')}`)
      setTimeout(() => scrollIntoView())
    }
  }, [navigate, pathname, setActiveNodeArray, scrollIntoView])

  return null
}

export default ActiveNodeArraySetter
