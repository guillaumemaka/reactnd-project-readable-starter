import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PostItem from './PostItem'
import SortControl from './shared/SortControl'

class PostsList extends Component {
  renderPosts () {
    const { posts, onVoteDown, onVoteUp } = this.props
    if (posts !== []) {
      return posts.map(p => {
        return (
          <PostItem
            key={p.id}
            post={p}
            onVoteUp={onVoteUp}
            onVoteDown={onVoteDown}
          />
        )
      })
    }
  }
  render () {
    const { onSortChange } = this.props
    return (
      <div>
        <SortControl
          onSortChange={onSortChange}
          defaultSortKey='voteScore'
          sortKeys={['timestamp', 'voteScore']}
          sortLabels={['Date', 'Vote Score']}
        />
        {this.renderPosts()}
      </div>
    )
  }
}

PostsList.propTypes = {
  posts: PropTypes.array.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onVoteDown: PropTypes.func.isRequired,
  onVoteUp: PropTypes.func.isRequired
}

export default PostsList
