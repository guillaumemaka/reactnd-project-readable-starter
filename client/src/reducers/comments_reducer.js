import * as ActionTypes from '../actions/types'
import sortBy from 'sort-by'

const initialState = {
  all: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COMMENTS:
      return {
        ...state,
        all: {
          ...state.all,
          [action.postId]: action.comments
            .filter(c => !c.deleted && !c.parentDeleted)
            .reduce((comments, comment) => {
              comments[comment.id] = comment
              return comments
            }, {})
        }
      }
    case ActionTypes.UPVOTE_COMMENT:
    case ActionTypes.DOWNVOTE_COMMENT:
    case ActionTypes.EDIT_COMMENT:
    case ActionTypes.ADD_COMMENT:
      return {
        ...state,
        all: {
          ...state.all,
          [action.comment.parentId]: {
            ...state.all[action.comment.parentId],
            [action.comment.id]: action.comment
          }
        }
      }
    case ActionTypes.DELETE_COMMENT:
      if (state.all[action.comment.parentId]) {
        if (state.all[action.comment.parentId][action.comment.id]) {
          delete state.all[action.comment.parentId][action.comment.id]
        }
      }
      return state
    case ActionTypes.SORT_COMMENTS:
      let { postId, sortKey, direction } = action

      if (direction === 'desc') {
        sortKey = `-${sortKey}`
      }

      return {
        ...state,
        all: {
          ...state.all,
          [postId]: Object.keys(state.all[postId])
            .map(k => state.all[postId][k])
            .sort(sortBy(sortKey))
            .reduce((comments, currentComment) => {
              comments[currentComment.id] = currentComment
              return comments
            }, {})
        }
      }
    default:
      return state
  }
}
