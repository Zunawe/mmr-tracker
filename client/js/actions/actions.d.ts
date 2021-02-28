declare interface Action {
  type: ActionType
  payload: any
}

declare type Thunk = (dispatch: (action: Action | Thunk) => void) => void
