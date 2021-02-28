declare interface Item {
  id: number
  name: string
  whereAmI: number
  acquired: boolean
  isFake: boolean
}

declare interface ItemLocation {
  id: number
  name: string
  whatAmI: number
  conditionalRequiredItems: number[][]
  requiredItems: number[]
}

declare type Dispatch = (action: Action | Thunk) => void
