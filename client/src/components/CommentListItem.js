import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Card, Col, Icon, Button } from 'react-materialize'
import RichEditor from './RichEditor'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import { EditorState } from 'draft-js'
import Moment from 'react-moment'
import Vote from './shared/Vote'

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

    this.endEditing()
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

  endEditing = () => {
    this.setState({
      isEditing: false,
      editorState: EditorState.createWithContent(
        stateFromHTML(this.props.comment.body)
      )
    })
    this.props.onEndEditing(this.state.isEditing)
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
        <Button
          style={{ marginRight: '10px' }}
          className="red darken-1"
          key="cancel"
          waves="light"
          onClick={this.onCancel}
        >
          Cancel
        </Button>,
        <Button
          className="green darken-1"
          key="save"
          waves="light"
          onClick={this.onEdit}
        >
          Save
        </Button>
      ]
    }

    return [
      <a
        key="edit"
        className="green-text darken-1"
        href="#edit"
        onClick={this.startEditing}
      >
        <Icon>mode_edit</Icon>
      </a>,
      <a
        key="delete"
        className="red-text darken-1"
        href="#delete"
        onClick={this.onDelete}
      >
        <Icon>delete</Icon>
      </a>
    ]
  }

  _checkOwnership = () => {
    if (this.props.checkOwnership) {
      return this.props.checkOwnership(this.props.comment)
    }
    return true
  }

  render() {
    const { comment } = this.props
    return (
      <Row className="CommentListItem">
        <Col className="hide-on-small-only" m={1}>
          <Vote
            count={comment.voteScore}
            onVoteDown={() => this.props.onVoteDown(comment)}
            onVoteUp={() => this.props.onVoteUp(comment)}
            iconUp={<Icon medium>expand_less</Icon>}
            iconDown={<Icon medium>expand_more</Icon>}
          />
        </Col>
        <Col s={12} m={11}>
          <Card actions={this._checkOwnership() ? this.renderActions() : []}>
            <Vote
              style={{
                fontSize: '14px',
                position: 'absolute',
                top: '1em',
                right: '.25em',
                zIndex: 100
              }}
              className="hide-on-med-and-up"
              count={comment.voteScore}
              onVoteDown={() => this.props.onVoteDown(comment)}
              onVoteUp={() => this.props.onVoteUp(comment)}
              iconUp={<Icon medium>expand_less</Icon>}
              iconDown={<Icon medium>expand_more</Icon>}
            />
            {!this.state.isEditing && (
              <span className="valign-wrapper">
                <Icon>account_circle</Icon>&nbsp;{this.props.comment.author}{' '}
                &nbsp;said&nbsp;
                <Moment fromNow>{this.props.comment.timestamp}</Moment>
              </span>
            )}
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
  onEndEditing: PropTypes.func,
  checkOwnership: PropTypes.func
}

export default CommentListItem
