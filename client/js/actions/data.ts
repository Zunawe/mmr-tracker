export enum ActionType {
  SET_ITEMS,
  SET_LOCATIONS
}

export const setItems = (items: Item[]): Action => ({
  type: ActionType.SET_ITEMS,
  payload: items
})

export const setLocations = (locations: ItemLocation[]): Action => ({
  type: ActionType.SET_LOCATIONS,
  payload: locations
})
