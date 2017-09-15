import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-materialize'
import SortControl from './shared/SortControl'
import CommentListItem from './CommentListItem'

class CommentList extends Component {
  renderComments () {
    if (this.props.comments === []) {
      return (
        <Row>
          <Col className='valign-wrapper' s={12}>
            <p className='center'>
              <strong>No comments found!</strong>
            </p>
          </Col>
        </Row>
      )
    }

    return this.props.comments.map(c => {
      return (
        <CommentListItem
          comment={c}
          key={c.id}
          onVoteUp={this.props.onVoteUp}
          onVoteDown={this.props.onVoteDown}
          onEdit={this.props.onEdit}
          onDelete={this.props.onDelete}
          onStartEditing={this.props.onStartEditing}
          onEndEditing={this.props.onEndEditing}
        />
      )
    })
  }

  renderSortControl () {
    return (
      <SortControl
        onSortChange={this.props.onSortChange}
        defaultSortKey='scoreVote'
        sortKeys={['scoreVote', 'timestamp']}
        sortLabels={['By Score Vote', 'Date']}
      />
    )
  }

  render () {
    return <div>{!!this.props.comments && this.renderComments()}</div>
  }
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onVoteUp: PropTypes.func.isRequired,
  onVoteDown: PropTypes.func.isRequired,
  onStartEditing: PropTypes.func,
  onEndEditing: PropTypes.func,
  onSortChange: PropTypes.func.isRequired
}

export default CommentList
