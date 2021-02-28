import React, { FC, createContext, useReducer, useCallback } from 'react'

import reducer from '../reducers/data'

const initialState = {
  items: [],
  locations: []
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
