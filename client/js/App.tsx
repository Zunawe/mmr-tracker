import React, { FC, useContext, useCallback } from 'react'

import { setItems, setLocations, recalculateAvailability } from './context/actions/app'
import { LocationCard, FileSelector } from './components'
import { AppContext } from './context/app'

const getItemNameAtLocation = (id: number, doc: Document): string | null => {
  const name = doc.querySelector(`.item-replacements tr[data-newlocationid="${id}"] .itemname span`)?.getAttribute('data-content')
  return name ?? null
}

const getItemAtLocation = (id: number, doc: Document): number => {
  const itemId = doc.querySelector(`.item-replacements tr[data-newlocationid="${id}"]`)?.getAttribute('data-id')
  return itemId === null || itemId === undefined ? -1 : Number.parseInt(itemId)
}

const getLocationName = (id: number, doc: Document): string | null => {
  const name = doc.querySelector(`.item-replacements tr[data-newlocationid="${id}"] .newLocation`)?.innerHTML
  return name ?? null
}

export const App: FC = () => {
  const [state, dispatch] = useContext(AppContext)

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

      const locations: ItemLocation[] = logic.reduce((acc, data, i) => {
        acc[i] = {
          id: i,
          name: getLocationName(i, trackerDom),
          whatAmI: getItemAtLocation(i, trackerDom),
          conditionalRequiredItems: data.ConditionalItemIds,
          requiredItems: data.RequiredItemIds,
          isAvailable: false,
          checked: false
        }

        return acc
      }, [])

      let items: Item[] = logic.reduce((acc, data, i) => {
        acc[i] = {
          id: i,
          name: '',
          whereAmI: -1,
          acquired: data.Acquired,
          isFake: data.IsFakeItem
        }

        return acc
      }, [])

      items = locations.reduce<Item[]>((items, location, i) => {
        items[location.whatAmI] = {
          ...items[location.whatAmI],
          name: getItemNameAtLocation(location.id, trackerDom),
          whereAmI: location.id
        }

        return items
      }, items)

      startingLocations.forEach((locationId) => {
        const location = locations[locationId]
        location.checked = true
        if (items[location.whatAmI] !== undefined) {
          items[location.whatAmI].acquired = true
        }
      })

      dispatch(setItems(items))
      dispatch(setLocations(locations))
      dispatch(recalculateAvailability())
    }

    reader.readAsText(file)
  }, [])

  // const uncheckedLocations = state.locations.filter(({ isAvailable, checked }) => isAvailable && !checked).map(({ id }) => id)

  return (
    <>
      <FileSelector onChange={handleFileSelection} />
      <div className='cardColumn'>
        {/* {uncheckedLocations.map((id) => <LocationCard key={id} locationId={id} />)} */}
        {state.locations.map(({ id }) => <LocationCard key={id} locationId={id} />)}
      </div>
    </>
  )
}
