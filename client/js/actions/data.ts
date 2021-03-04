import { Item, ItemLocation } from '../reducers/data'

export enum ActionType {
  SET_ITEMS,
  SET_LOCATIONS,
  RECALCULATE_AVAILABILITY
}

export const setItems = (items: Map<number, Item>): Action => ({
  type: ActionType.SET_ITEMS,
  payload: items
})

export const setLocations = (locations: Map<number, ItemLocation>): Action => ({
  type: ActionType.SET_LOCATIONS,
  payload: locations
})

export const recalculateAvailability = (): Action => ({
  type: ActionType.RECALCULATE_AVAILABILITY
})
