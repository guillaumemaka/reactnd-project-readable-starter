import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PostItem from './PostItem'
import SortControl from './shared/SortControl'
import { Row, Col, Card } from 'react-materialize'

class PostsList extends Component {
  renderPosts() {
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
  render() {
    const { onSortChange, posts } = this.props
    return (
      <div>
        <Row className="right">
          <SortControl
            onSortChange={onSortChange}
            defaultSortKey="voteScore"
            sortKeys={['timestamp', 'voteScore']}
            sortLabels={['Date', 'Vote Score']}
            direction="desc"
          />
        </Row>
        <Row>
          <Col s={12}>
            {!posts.length && (
              <Row>
                <Card>
                  <p className="center-align">Nothing to show here...</p>
                </Card>
              </Row>
            )}
            {posts && this.renderPosts()}
          </Col>
        </Row>
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
