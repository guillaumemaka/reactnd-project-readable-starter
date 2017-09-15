import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Card, Col, Input, Icon, Button } from 'react-materialize'
import RichEditor from './RichEditor'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import { EditorState } from 'draft-js'
import Moment from 'react-moment'
import Vote from './shared/Vote'
import SortControl from './shared/SortControl'

import './CommentListItem.css'

class CommentListItem extends Component {
  state = {
    isEditing: false,
    editorState: EditorState.createEmpty()
  }

  onEdit = e => {
    e.preventDefault()
    this.props.onEdit({
      ...this.props.comment,
      body: this.state.body
    })
  }

  onDelete = e => {
    e.preventDefault()
    this.props.onDelete(this.props.comment)
  }

  onCancel = e => {
    this.setState({
      isEditing: false,
      editorState: EditorState.createEmpty()
    })
    this.props.onEndEditing(this.state.isEditing)
  }

  startEditing = () => {
    this.setState({
      isEditing: true,
      editorState: EditorState.createWithContent(
        stateFromHTML(this.props.comment.body)
      )
    })
    this.props.onStartEditing(this.state.isEditing)
  }

  onEditorChange = editorState => {
    this.setState({
      editorState,
      body: stateToHTML(editorState.getCurrentContent())
    })
  }

  renderBody() {
    if (this.state.isEditing) {
      return (
        <RichEditor
          editorState={this.state.editorState}
          onChange={this.onEditorChange}
        />
      )
    }

    const html = {
      __html: this.props.comment.body
    }
    return (
      <p className="CommentListItem__Body" dangerouslySetInnerHTML={html} />
    )
  }

  renderActions() {
    if (this.state.isEditing) {
      return [
        <Button node="a" key="cancel" waves="light" onClick={this.onCancel}>
          Cancel
        </Button>,
        <Button node="a" key="save" waves="light" onClick={this.onEdit}>
          Save
        </Button>
      ]
    }

    return [
      <Button node="a" key="edit" waves="light" onClick={this.startEditing}>
        Edit
      </Button>,
      <Button node="a" key="delete" waves="light" onClick={this.onDelete}>
        Delete
      </Button>
    ]
  }

  render() {
    const { comment } = this.props
    return (
      <Row className="CommentListItem">
        <Col className="hide-on-small-only" m={1}>
          <Vote
            count={comment.voteScore}
            onVoteDown={this.props.onVoteDown}
            onVoteUp={this.props.onVoteUp}
            iconUp={<Icon medium>expand_less</Icon>}
            iconDown={<Icon medium>expand_more</Icon>}
          />
        </Col>
        <Col s={12} m={11}>
          <Card actions={this.renderActions()}>
            <span className="valign-wrapper">
              <Icon>account_circle</Icon>&nbsp;{this.props.comment.author}{' '}
              &nbsp;said&nbsp;
              <Moment fromNow>{this.props.comment.timestamp}</Moment>
            </span>
            {this.renderBody()}
          </Card>
        </Col>
      </Row>
    )
  }
}

CommentListItem.propTypes = {
  comment: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onVoteUp: PropTypes.func.isRequired,
  onVoteDown: PropTypes.func.isRequired,
  onStartEditing: PropTypes.func,
  onEndEditing: PropTypes.func
}

export default CommentListItem
