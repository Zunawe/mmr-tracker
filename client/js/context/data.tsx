import React, { FC, createContext, useReducer, useCallback } from 'react'

import { reducer, DataState, Item, ItemLocation } from '../reducers/data'

const initialState: DataState = {
  items: new Map<number, Item>(),
  locations: new Map<number, ItemLocation>()
}

export const DataContext = createContext<[DataState, Dispatch]>([initialState, () => {}])

export const DataContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const combinedDispatch = useCallback((action: Action | Thunk) => {
    if (typeof action === 'function') {
      action(combinedDispatch)
    } else {
      dispatch(action)
    }
  }, [dispatch])

  return (
    <DataContext.Provider value={[state, combinedDispatch]}>
      {children}
    </DataContext.Provider>
  )
}
