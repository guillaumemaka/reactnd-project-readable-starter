import * as ActionTypes from './types'
import * as ReadableAPI from '../utils/api'
import { push } from 'react-router-redux'

/***********************************
 * Actions Creators
 **********************************/

export const fetchingPosts = isFetching => {
  return {
    type: ActionTypes.FETCHING_POSTS,
    isFetching
  }
}

export const fetchingComments = isFetching => {
  return {
    type: ActionTypes.FETCHING_COMMENTS,
    isFetching
  }
}

export const notify = (category, message) => {
  return {
    type: ActionTypes.NOTIFY,
    id: Date.now(),
    category,
    message
  }
}

export const editPost = post => {
  return {
    type: ActionTypes.EDIT_POST,
    post
  }
}

export const createdPost = post => {
  return {
    type: ActionTypes.CREATE_POST,
    post
  }
}

export const editedPostBodyChange = text => {
  return {
    type: ActionTypes.EDITED_POST_CHANGE,
    text
  }
}

export const updatedPost = post => {
  return {
    type: ActionTypes.UPDATE_POST,
    post
  }
}

export const fetchedPosts = (posts, type = ActionTypes.FETCH_POSTS) => {
  return {
    type,
    posts
  }
}

export const fetchedPost = post => {
  return {
    type: ActionTypes.FETCH_POST,
    post
  }
}

export const deletedPost = post => {
  return {
    type: ActionTypes.DELETE_POST,
    post
  }
}

export const addedComment = comment => {
  return { type: ActionTypes.ADD_COMMENT, comment }
}

export const fetchedComments = (postId, comments) => {
  return {
    type: ActionTypes.FETCH_COMMENTS,
    postId,
    comments
  }
}

export const sortPosts = ({ sortKey, direction }) => {
  return {
    type: ActionTypes.SORT_POSTS,
    sortKey,
    direction
  }
}

export const upvotedPost = post => {
  return {
    type: ActionTypes.UPVOTE_POST,
    post
  }
}

export const downvotedPost = post => {
  return {
    type: ActionTypes.DOWNVOTE_POST,
    post
  }
}

export const onNewPostChange = post => {
  return {
    type: ActionTypes.ON_NEW_POST_CHANGE,
    post
  }
}

/**********************************
 * Comment Actions creator
 **********************************/

export const sortComments = (postId, { sortKey, direction }) => {
  return {
    type: ActionTypes.SORT_COMMENTS,
    postId,
    sortKey,
    direction
  }
}

export const deletedComment = comment => {
  return {
    type: ActionTypes.DELETE_COMMENT,
    comment
  }
}

export const editedComment = comment => {
  return {
    type: ActionTypes.EDIT_COMMENT,
    comment
  }
}

export const upvotedComment = comment => {
  return {
    type: ActionTypes.UPVOTE_COMMENT,
    comment
  }
}

export const downvotedComment = comment => {
  return {
    type: ActionTypes.DOWNVOTE_COMMENT,
    comment
  }
}

export const gotCommentCount = (postId, count) => {
  return {
    type: ActionTypes.GET_COMMENT_COUNT,
    postId,
    count
  }
}

/**********************************
 * Categories Actions creator
 **********************************/

export const fetchedCategories = categories => {
  return {
    type: ActionTypes.FETCH_CATEGORIES,
    categories
  }
}

/**********************************
 * Draft-js Actions creator
 **********************************/

export const updateEditorState = (editorState, view) => {
  return {
    type: ActionTypes.UPDATE_EDITOR_STATE,
    editorState,
    view
  }
}

export const initEditorWithContent = content => dispatch => {
  dispatch({
    type: ActionTypes.INIT_EDITOR_STATE_WITH_CONTENT,
    content
  })
}

export const resetEditor = () => {
  return {
    type: ActionTypes.RESET_EDITOR_STATE
  }
}

/**********************************
 * Async Actions
 **********************************/

/**********************************
 * Posts
 **********************************/

export const fetchPost = id => async dispatch => {
  dispatch(fetchingPosts(true))

  try {
    const post = await ReadableAPI.getPost(id)
    dispatch(fetchedPost(post))
  } catch (error) {
    console.log(error)
    dispatch(notify('error', error.response.data.error))
  }

  dispatch(fetchingPosts(false))
}

export const fetchPosts = () => async dispatch => {
  dispatch(fetchingPosts(true))

  try {
    const posts = await ReadableAPI.getPosts()
    dispatch(fetchedPosts(posts))
    getCommentCounts(posts)(dispatch)
  } catch (error) {
    console.log(error)
    dispatch(notify('error', error.response.data.error))
  }

  dispatch(fetchingPosts(false))
}

export const fetchPostsByCategory = category => async dispatch => {
  dispatch(fetchingPosts(true))

  try {
    const posts = await ReadableAPI.getPostsForCategory(category)
    dispatch(fetchedPosts(posts, ActionTypes.FETCH_POSTS_FOR_CATEGORY))
    getCommentCounts(posts)(dispatch)
  } catch (error) {
    console.log(error)
    dispatch(notify('error', error.response.data.error))
  }

  dispatch(fetchingPosts(false))
}

export const deletePost = post => async dispatch => {
  try {
    const p = await ReadableAPI.deletePost(post.id)
    dispatch(deletedPost(p))
    dispatch(notify('success', 'Post deleted!'))
    dispatch(push('/'))
  } catch (error) {
    console.log(error)
    dispatch(notify('error', error.response.data.error))
  }
}

export const updatePost = post => async dispatch => {
  try {
    const p = await ReadableAPI.updatePost(post)
    dispatch(updatedPost(p))
    dispatch(resetEditor())
    dispatch(notify('success', 'Post updated!'))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const createPost = ({
  author,
  body,
  category,
  title
}) => async dispatch => {
  try {
    const p = await ReadableAPI.createPost({
      id: Date.now(),
      timestamp: Date.now(),
      author: author,
      body,
      category,
      title
    })
    dispatch(createdPost(p))
    dispatch(resetEditor())
    dispatch(notify('success', 'Post created!'))
    dispatch(push(`/p/${p.id}`))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const fetchComments = postId => async dispatch => {
  try {
    const comments = await ReadableAPI.getCommentsForPost(postId)
    dispatch(fetchedComments(postId, comments))
  } catch (error) {
    console.log(error)
    dispatch(notify('error', error.response.data.error))
  }
}

export const upVotePost = ({ id }) => async dispatch => {
  try {
    const post = await ReadableAPI.upVotePost(id)
    dispatch(upvotedPost(post))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const downVotePost = ({ id }) => async dispatch => {
  try {
    const post = await ReadableAPI.downVotePost(id)
    dispatch(downvotedPost(post))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

/**********************************
 * Comments
 **********************************/

export const addComment = ({ body, author, parentId }) => async dispatch => {
  try {
    const id = Date.now()
    const comment = await ReadableAPI.createComment({
      id,
      body,
      parentId,
      author,
      timestamp: Date.now()
    })
    dispatch(addedComment(comment))
    dispatch(notify('success', 'Comment added!'))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const deleteComment = ({ id }) => async dispatch => {
  try {
    const comment = await ReadableAPI.deleteComment(id)
    dispatch(deletedComment(comment))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const editComment = ({ id, body, timestamp }) => async dispatch => {
  try {
    const comment = await ReadableAPI.updateComment({ id, body, timestamp })
    dispatch(editedComment(comment))
    dispatch(notify('success', 'Comment edited!'))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const upVoteComment = ({ id }) => async dispatch => {
  try {
    const comment = await ReadableAPI.upVoteComment(id)
    dispatch(upvotedComment(comment))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const downVoteComment = ({ id }) => async dispatch => {
  try {
    const comment = await ReadableAPI.downVoteComment(id)
    dispatch(downvotedComment(comment))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

export const getCommentCounts = posts => async dispatch => {
  posts.forEach(async p => {
    try {
      const posts = await ReadableAPI.getCommentsForPost(p.id)
      dispatch(gotCommentCount(p.id, posts.length))
    } catch (error) {
      console.log(error)
      dispatch(gotCommentCount(p.id, 0))
    }
  })
}

/**********************************
 * Categories
 **********************************/

export const fetchCategories = () => async dispatch => {
  try {
    const categories = await ReadableAPI.getCategories()
    dispatch(fetchedCategories(categories))
  } catch (error) {
    dispatch(notify('error', error.response.data.error || 'An error occured!'))
  }
}

/**********************************
 * Notifications
 **********************************/

export const clearNotification = id => dispatch => {
  dispatch({ type: ActionTypes.CLEAR_NOTIFICATION, id })
}
