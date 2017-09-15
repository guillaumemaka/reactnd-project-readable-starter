import * as ActionTypes from '../actions/types'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.NOTIFY:
      const { category, message, id } = action
      return [...state, { id, category, message }]
    case ActionTypes.CLEAR_NOTIFICATION:
      return state.filter(n => n.id !== action.id)
    default:
      return state
  }
}
