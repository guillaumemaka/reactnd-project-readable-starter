import axios from 'axios'

const ReadableAPI = axios.create({
  baseURL: process.env.HOST
})

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token) {
  token = localStorage.token = Math.random()
    .toString(36)
    .substr(-8)
}

const headers = {
  Accept: 'application/json',
  Authorization: token
}

ReadableAPI.defaults.headers.common = headers

export const getPosts = async () => {
  const res = await axios.get('/api/posts')
  return res.data.filter(p => p.deleted === false)
}

export const getPost = async id => {
  const res = await axios.get(`/api/posts/${id}`)
  return res.data
}

export const createPost = async post => {
  const res = await axios.post('/api/posts', post)
  return res.data
}

export const updatePost = async post => {
  const res = await axios.put(`/api/posts/${post.id}`, post)
  return res.data
}

export const deletePost = async id => {
  const res = await axios.delete(`/api/posts/${id}`)
  return res.data
}

export const upVotePost = async id => {
  const res = await axios.post(`/api/posts/${id}`, { option: 'upVote' })
  return res.data
}

export const downVotePost = async id => {
  const res = await axios.post(`/api/posts/${id}`, { option: 'downVote' })
  return res.data
}

export const getCommentsForPost = async post_id => {
  const res = await axios.get(`/api/posts/${post_id}/comments`)
  return res.data
}

export const getComment = async id => {
  const res = await axios.get(`/api/comments/${id}`)
  return res.data
}

export const createComment = async comment => {
  const res = await axios.post(`/api/comments`, comment)
  return res.data
}

export const upVoteComment = async id => {
  const res = await axios.post(`/api/comments/${id}`, {
    option: 'upVote'
  })
  return res.data
}

export const downVoteComment = async id => {
  const res = await axios.post(`/api/comments/${id}`, { option: 'downVote' })
  return res.data
}

export const updateComment = async comment => {
  const { id, timestamp, body } = comment
  const res = await axios.put(`/api/comments/${id}`, { timestamp, body })
  return res.data
}

export const deleteComment = async id => {
  const res = await axios.delete(`/api/comments/${id}`)
  return res.data
}

export const getPostsForCategory = async category => {
  const res = await axios.get(`/api/${category}/posts`)
  return res.data
}

export const getCategories = async () => {
  const res = await axios.get('/api/categories')
  return res.data.categories
}
