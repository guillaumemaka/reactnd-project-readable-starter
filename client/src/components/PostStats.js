import React from 'react'
import { Icon } from 'react-materialize'
import './PostStats.css'

const PostStats = ({ voteScore, commentCount }) => {
  return (
    <div
      className="PostStat cyan-text darken-1"
      style={{ margin: 'auto', display: 'inline' }}
    >
      <span className="PostStats__stat right" style={{ marginLeft: '5px' }}>
        {commentCount}
        <Icon right>comment</Icon>
      </span>
      <span style={{ marginLeft: '5px' }} className="PostStats__stat right">
        {voteScore}
        <Icon right>swap_vert</Icon>
      </span>
    </div>
  )
}

export default PostStats
