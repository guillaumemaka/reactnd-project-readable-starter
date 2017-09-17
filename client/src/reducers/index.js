import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import comments from './comments_reducer'
import posts from './posts_reducer'
import categories from './categories_reducer'
import notifications from './notifications_reducer'

export default combineReducers({
  comments,
  categories,
  notifications,
  posts,
  routing: routerReducer
})
