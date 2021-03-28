import React, { FC, useCallback, useContext } from 'react'
import { checkLocation } from '../context/actions/app'
import { AppContext } from '../context/app'

interface LocationCardProps {
  locationId: number
}

export const LocationCard: FC<LocationCardProps> = ({ locationId }) => {
  const [state, dispatch] = useContext(AppContext)

  const locationData = state.locations[locationId]
  const itemData = state.items[locationData.whatAmI]

  const handleChange = useCallback(() => {
    dispatch(checkLocation(locationId))
  }, [])

  if (locationData.name === null) {
    return null
  }

  const classNames = ['locationCard']
  if (locationData.checked) {
    classNames.push('locationCard--checked')
  } else if (locationData.isAvailable) {
    classNames.push('locationCard--available')
  } else {
    classNames.push('locationCard--unavailable')
  }

  return (
    <div className={classNames.join(' ')}>
      <input type='checkbox' checked={locationData.checked} onChange={handleChange} />
      <span>{locationData.name}</span>
      <span>{locationData.checked ? itemData.name : ''}</span>
    </div>
  )
}
