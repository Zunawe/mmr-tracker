declare abstract class Action {
  payload?: any
  constructor (payload?: any)
}

declare interface Item {
  id: number
  name: string | null
  whereAmI: number
  acquired: boolean
  isFake: boolean
}

declare interface ItemLocation {
  id: number
  name: string | null
  whatAmI: number
  conditionalRequiredItems: number[][]
  requiredItems: number[]
  isAvailable: boolean
  checked: boolean
}

declare interface State {
  items: Item[]
  locations: ItemLocation[]
}

declare interface Store {
  state: State
  dispatch: Dispatch
  getState: () => State
}

declare type Reducer = (state: State, action: Action) => State
declare type Dispatch = ((value: any) => void)
declare type Middleware = (store: Store) => (next: Dispatch) => Dispatch
