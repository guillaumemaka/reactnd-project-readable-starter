import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card } from 'react-materialize'
import SortControl from './shared/SortControl'
import CommentListItem from './CommentListItem'

class CommentList extends Component {
  renderComments() {
    if (!this.props.comments.length) {
      return (
        <Row>
          <Card className="center-align">
            <strong>No comments found! Be the first to add one.</strong>
          </Card>
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
          checkOwnership={this.props.checkOwnership}
        />
      )
    })
  }

  renderSortControl() {
    return (
      <SortControl
        onSortChange={this.props.onSortChange}
        defaultSortKey="voteScore"
        sortKeys={['voteScore', 'timestamp']}
        sortLabels={['By Score Vote', 'Date']}
        direction="desc"
      />
    )
  }

  render() {
    return (
      <div>
        <Row>
          <Col className="valign-wrapper" m={11}>
            <h4>
              Comments ({this.props.comments ? (
                this.props.comments.length
              ) : (
                '0'
              )})
            </h4>
          </Col>
          {!!this.props.comments.length && (
            <Col className="valign-wrapper" m={1}>
              {this.renderSortControl()}
            </Col>
          )}
        </Row>
        {this.renderComments()}
      </div>
    )
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
  onSortChange: PropTypes.func.isRequired,
  checkOwnership: PropTypes.func
}

export default CommentList
