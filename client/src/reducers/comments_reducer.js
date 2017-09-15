import * as ActionTypes from '../actions/types'
import sortBy from 'sort-by'

const initialState = {
  all: {},
  editedComment: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_COMMENTS:
      return {
        ...state,
        all: {
          ...state.all,
          [action.postId]: action.comments.reduce((comments, comment) => {
            comments[comment.id] = comment
            return comments
          }, {})
        }
      }
    case ActionTypes.UPVOTE_COMMENT:
    case ActionTypes.DOWNVOTE_COMMENT:
    case ActionTypes.EDIT_COMMENT:
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
      delete state.all[action.postId][action.comment.id]
      return state
    case ActionTypes.SORT_COMMENTS:
      let { parentId, sortKey, direction } = action

      if (direction === 'desc') {
        sortKey = `-${sortKey}`
      }

      return {
        ...state,
        all: {
          [parentId]: Object.keys(state.all[parentId])
            .map(k => state.all[parentId][k])
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
