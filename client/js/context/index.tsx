import React, { FC, ReactNode } from 'react'
import { DataContextProvider } from './data'

interface ContextProviderProps {
  children: ReactNode
}

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return (
    <DataContextProvider>
      {children}
    </DataContextProvider>
  )
}
