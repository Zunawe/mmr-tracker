import { ActionType } from '../actions/data'

export interface DataState {
  items: Map<number, Item>
  locations: Map<number, ItemLocation>
}

export interface Item {
  id: number
  name: string | null
  whereAmI: number
  acquired: boolean
  isFake: boolean
}

export interface ItemLocation {
  id: number
  name: string | null
  whatAmI: number
  conditionalRequiredItems: number[][]
  requiredItems: number[]
  isAvailable: boolean
  checked: boolean
}

export const reducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case ActionType.SET_ITEMS:
      return {
        ...state,
        items: action.payload
      }
    case ActionType.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      }
    case ActionType.RECALCULATE_AVAILABILITY:
      (() => {
        let dirty = true

        while (dirty) {
          dirty = false

          state.locations.forEach((location, id) => {
            location.isAvailable =
              (location.requiredItems.length === 0 || location.requiredItems.every((itemId) => state.items.get(itemId)?.acquired ?? false)) &&
              (location.conditionalRequiredItems.length === 0 || location.conditionalRequiredItems.some((itemList) => itemList.every((itemId) => state.items.get(itemId)?.acquired ?? false)))

            const itemNormallyHere = state.items.get(id)
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
          })
        }
      })()
      return state
    default:
      return state
  }
}
