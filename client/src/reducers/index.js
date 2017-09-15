import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import comments from './comments_reducer'
import editorState from './editor_reducer'
import posts from './posts_reducer'
import categories from './categories_reducer'
import notifications from './notifications_reducer'

export default combineReducers({
  comments,
  editorState,
  categories,
  notifications,
  posts,
  routing: routerReducer
})
