import React, { FC, useCallback, useContext } from 'react'

import { recalculateAvailability, setItems, setLocations } from './actions/data'
import { Item, ItemLocation } from './reducers/data'
import { FileSelector } from './components'
import { DataContext } from './context/data'

const getLocationName = (id: number, doc: Document): string | null => {
  const name = doc.querySelector(`.item-replacements tr[data-newlocationid="${id}"] .newlocation`)?.innerHTML
  return name ?? null
}

const getItemName = (id: number, doc: Document): string | null => {
  const name = doc.querySelector(`#item-locations tr[data-id="${id}"] td`)?.innerHTML
  return name ?? null
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

      const startingLocationsString = trackerHtml.match(/var startingLocations = (.*);/)?.[1]
      if (startingLocationsString === undefined) {
        throw new Error('Failed to parse starting locations')
      }
      const startingLocations: number[] = JSON.parse(startingLocationsString)

      const items = logic.reduce((map, data, i) => {
        const item: Item = {
          id: i,
          name: getItemName(i, trackerDom),
          whereAmI: getLocationOfItem(i, trackerDom),
          acquired: data.Acquired,
          isFake: data.IsFakeItem
        }

        map.set(i, item)

        return map
      }, new Map<Number, Item>())

      const locations = logic.reduce((map, data, i) => {
        const location: ItemLocation = {
          id: i,
          name: getLocationName(i, trackerDom),
          whatAmI: getLocationOfItem(i, trackerDom),
          conditionalRequiredItems: data.ConditionalItemIds,
          requiredItems: data.RequiredItemIds,
          isAvailable: false,
          checked: false
        }

        map.set(i, location)

        return map
      }, new Map<Number, ItemLocation>())

      startingLocations.forEach((locationId) => {
        const location = locations.get(locationId)
        location.checked = true
        if (items.get(location.whatAmI) !== undefined) {
          items.get(location.whatAmI).acquired = true
        }
      })

      dataDispatch(setItems(items))
      dataDispatch(setLocations(locations))
      dataDispatch(recalculateAvailability())
    }

    reader.readAsText(file)
  }, [])

  return (
    <FileSelector onChange={handleFileSelection} />
  )
}
