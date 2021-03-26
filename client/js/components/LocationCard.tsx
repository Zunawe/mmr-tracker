import React, { FC, useCallback, useContext } from 'react'
import { checkLocation } from '../context/actions/app'
import { AppContext } from '../context/app'

interface LocationCardProps {
  locationId: number
}

export const LocationCard: FC<LocationCardProps> = ({ locationId }) => {
  const [state, dispatch] = useContext(AppContext)

  const locationData = state.locations[locationId]

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(checkLocation(locationId))
  }, [])

  if (locationData.name === null) {
    return null
  }

  return (
    <div>
      <button onClick={handleClick}>
        {locationData.name}
      </button>
    </div>
  )
}
