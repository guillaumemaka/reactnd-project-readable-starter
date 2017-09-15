import * as ActionTypes from '../actions/types'
import sortBy from 'sort-by'
import { stateToHTML } from 'draft-js-export-html'

const initialState = {
  isFetching: false,
  all: {},
  byCategory: {},
  post: null,
  isEditing: false,
  edited_post: null,
  new_post: {}
}

function normalizePost (posts) {
  return posts.reduce((prev, currentPost) => {
    prev[currentPost.id] = currentPost
    return prev
  }, {})
}

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      if (state.isEditing) {
        return {
          ...state,
          isEditing: false,
          edited_post: null
        }
      }
      return state
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
    case ActionTypes.EDIT_POST:
      return {
        ...state,
        isEditing: !!action.post,
        edited_post: action.post
      }
    case ActionTypes.UPDATE_EDITOR_STATE:
      const { editorState, view } = action

      switch (view) {
        case 'create':
          return {
            ...state,
            new_post: {
              ...state.new_post,
              body: stateToHTML(editorState.getCurrentContent())
            }
          }
        case 'edit':
          return {
            ...state,
            edited_post: {
              ...state.edited_post,
              body: stateToHTML(editorState.getCurrentContent())
            }
          }
        default:
          return state
      }

    case ActionTypes.ON_NEW_POST_CHANGE:
      return {
        ...state,
        new_post: {
          ...state.new_post,
          ...action.post
        }
      }
    case ActionTypes.UPDATE_POST:
      return {
        ...state,
        all: { ...state.all, [action.post.id]: action.post },
        post: action.post,
        edited_post: null,
        isEditing: false
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
      return { ...state, all: { ...state.all, [action.post.id]: action.post } }
    default:
      return state
  }
}
