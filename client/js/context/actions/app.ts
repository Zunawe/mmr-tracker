import { Action } from './Action'

export class SetItemsAction extends Action {}
export const setItems = (items: Item[]): SetItemsAction => (new SetItemsAction(items))

export class SetLocationsAction extends Action {}
export const setLocations = (locations: ItemLocation[]): SetLocationsAction => (new SetLocationsAction(locations))

export class RecalculateAvailabilityAction extends Action {}
export const recalculateAvailability = (): RecalculateAvailabilityAction => (new RecalculateAvailabilityAction())

export class CheckLocationAction extends Action {}
export const checkLocation = (locationId: number): CheckLocationAction => (new CheckLocationAction(locationId))
