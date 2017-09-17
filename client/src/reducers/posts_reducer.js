import * as ActionTypes from '../actions/types'
import sortBy from 'sort-by'
import { stateToHTML } from 'draft-js-export-html'

const initialState = {
  authorName: localStorage.authorName || '',
  isFetching: false,
  all: {}
}

function normalizePost(posts) {
  return posts.reduce((prev, currentPost) => {
    prev[currentPost.id] = currentPost
    return prev
  }, {})
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCHING_POSTS:
      const { isFetching } = action
      return { ...state, isFetching }
    case ActionTypes.FETCH_POSTS_FOR_CATEGORY:
      return {
        ...state,
        all: {
          ...normalizePost(action.posts)
        }
      }
    case ActionTypes.FETCH_POSTS:
      return {
        ...state,
        all: {
          ...normalizePost(action.posts)
        }
      }
    case ActionTypes.FETCH_POST:
      return {
        ...state,
        post: action.post
      }
    case ActionTypes.UPDATE_POST:
      return {
        ...state,
        all: {
          ...state.all,
          [action.post.id]: action.post
        },
        post: state.post.id === action.post.id ? action.post : state.post
      }
    case ActionTypes.GET_COMMENT_COUNT:
      return {
        ...state,
        all: {
          ...state.all,
          [action.postId]: {
            ...state.all[action.postId],
            commentCount: action.count
          }
        }
      }
    case ActionTypes.SORT_POSTS:
      let { sortKey, direction } = action

      if (direction === 'desc') {
        sortKey = `-${sortKey}`
      }

      return {
        ...state,
        all: Object.keys(state.all)
          .map(k => state.all[k])
          .sort(sortBy(sortKey))
          .reduce((prev, currentPost) => {
            prev[currentPost.id] = currentPost
            return prev
          }, {})
      }
    case ActionTypes.DOWNVOTE_POST:
    case ActionTypes.UPVOTE_POST:
      return {
        ...state,
        all: { ...state.all, [action.post.id]: action.post },
        post: action.post.id === state.post.id ? action.post : state.post
      }
    case ActionTypes.SET_AUTHOR_NAME:
      localStorage.authorName = action.authorName
      return { ...state, authorName: action.authorName }
    default:
      return state
  }
}
