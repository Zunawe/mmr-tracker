import { ActionType } from '../actions/data'

const reducer = (state: DataState, action: Action): DataState => {
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
    default:
      return state
  }
}

export default reducer
