import React, { FC, useCallback, useContext } from 'react'
import { setItems, setLocations } from './actions/data'

import { FileSelector } from './components'
import { DataContext } from './context/data'

const getLocationName = (id: number, doc: Document): string => {
  const name = doc.querySelector(`.item-replacements tr[data-newlocationid="${id}"] .newlocation`)?.innerHTML
  return name ?? 'NOT_FOUND'
}

const getItemName = (id: number, doc: Document): string => {
  const name = doc.querySelector(`#item-locations tr[data-id="${id}"] td`)?.innerHTML
  return name ?? 'NOT_FOUND'
}

const getLocationOfItem = (id: number, doc: Document): number => {
  const locationId = doc.querySelector(`#item-locations tr[data-id="${id}"]`)?.getAttribute('data-newlocationid')
  return locationId === null || locationId === undefined ? -1 : Number.parseInt(locationId)
}

export const App: FC = () => {
  const [/* data */, dataDispatch] = useContext(DataContext)

  const handleFileSelection = useCallback((file: File | undefined): void => {
    if (file === undefined) return

    const reader: FileReader = new FileReader()

    reader.onerror = (event) => {
      if (event.target === null) return
      const error = event.target.error
      console.error(`Error occured while reading ${file.name}`, error)
    }

    reader.onload = (event) => {
      if (event.target === null) return
      const trackerHtml = event.target.result as string

      const trackerDom = (new DOMParser()).parseFromString(trackerHtml, 'text/html')

      const logicString = trackerHtml.match(/var logic = (.*);/)?.[1]
      if (logicString === undefined) {
        throw new Error('Failed to parse logic')
      }

      const logic: any[] = JSON.parse(logicString)

      const items = logic.map((data, i) => {
        const item: Item = {
          id: i,
          name: getItemName(i, trackerDom),
          whereAmI: getLocationOfItem(i, trackerDom),
          acquired: data.Acquired,
          isFake: data.IsFakeItem
        }

        return item
      })

      const locations = logic.map((data, i) => {
        const location: ItemLocation = {
          id: i,
          name: getLocationName(i, trackerDom),
          whatAmI: getLocationOfItem(i, trackerDom),
          conditionalRequiredItems: data.ConditionalItemIds,
          requiredItems: data.RequiredItemIds
        }

        return location
      })

      dataDispatch(setItems(items))
      dataDispatch(setLocations(locations))
    }

    reader.readAsText(file)
  }, [])

  return (
    <FileSelector onChange={handleFileSelection} />
  )
}
