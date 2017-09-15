import * as ActionTypes from '../actions/types'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_CATEGORIES:
      return action.categories
    default:
      return state
  }
}
