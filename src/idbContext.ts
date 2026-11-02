import { createContext } from 'react'

export const idbContext = createContext({})
export const IdbProvider = idbContext.Provider
export const Consumer = idbContext.Consumer
