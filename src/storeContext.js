import { createContext } from 'react'

export const storeContext = createContext({})
export const MobxProvider = storeContext.Provider
export const Consumer = storeContext.Consumer
