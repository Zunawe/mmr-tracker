import * as Actions from '../actions/app'

const recalculate = (state: State): State => {
  let dirty = true

  while (dirty) {
    dirty = false

    for (const location of state.locations) {
      location.isAvailable =
        (location.requiredItems.length === 0 || location.requiredItems.every((itemId) => state.items[itemId]?.acquired ?? false)) &&
        (location.conditionalRequiredItems.length === 0 || location.conditionalRequiredItems.some((itemList) => itemList.every((itemId) => state.items[itemId]?.acquired ?? false)))

      const itemNormallyHere = state.items[location.id]
      if (itemNormallyHere !== undefined) {
        if (itemNormallyHere.isFake) {
          if (itemNormallyHere.acquired && !location.isAvailable) {
            itemNormallyHere.acquired = false
            dirty = true
          } else if (!itemNormallyHere.acquired && location.isAvailable) {
            itemNormallyHere.acquired = true
            dirty = true
          }
        }
      }
    }
  }

  return state
}

export const reducer: Reducer = (state, action) => {
  if (action instanceof Actions.SetItemsAction) {
    return {
      ...state,
      items: action.payload
    }
  } else if (action instanceof Actions.SetLocationsAction) {
    return {
      ...state,
      locations: action.payload
    }
  } else if (action instanceof Actions.RecalculateAvailabilityAction) {
    const newState = {
      ...state
    }
    return recalculate(newState)
  } else if (action instanceof Actions.CheckLocationAction) {
    const newState = {
      ...state,
      items: [...state.items],
      locations: [...state.locations]
    }

    newState.locations[action.payload].checked = true
    const acquiredItemId = newState.locations[action.payload].whatAmI
    if (acquiredItemId >= 0) newState.items[acquiredItemId].acquired = true

    return recalculate(newState)
  }
  return state
}
