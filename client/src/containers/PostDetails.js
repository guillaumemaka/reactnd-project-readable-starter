import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  editPost,
  initEditorWithContent,
  updateEditorState,
  updatePost,
  fetchPost,
  deletePost,
  fetchComments,
  addComment,
  editComment,
  upVoteComment,
  downVoteComment,
  sortComments
} from '../actions'
import {
  Collapsible,
  CollapsibleItem,
  Col,
  Row,
  Button,
  Icon
} from 'react-materialize'

import RichEditor from '../components/RichEditor'
import CommentBox from '../components/CommentBox'
import CommentList from '../components/CommentList'
import Moment from 'react-moment'
import 'moment-timezone'
import { goBack } from 'react-router-redux'

class PostDetails extends Component {
  componentWillMount() {
    this.props.fetchPost(this.props.postId)
    this.props.fetchComments(this.props.postId)
  }

  startEditing = e => {
    console.log('Start editing!')
    this.props.editPost(this.props.post)
    this.props.initEditorWithContent(this.props.post.body)
  }

  onChange = editorState => {
    this.props.updateEditorState(editorState, 'edit')
  }

  onDelete = () => {
    const { post } = this.props
    const confirm = window.confirm(`Are you sure to delete ${post.title}`)
    if (confirm) {
      this.props.deletePost(post)
    }
  }

  save = e => {
    console.log('Save!')
    this.props.updatePost(this.props.edited_post)
  }

  cancel = e => {
    console.log('Save!')
    this.props.editPost(null)
  }

  onCommentAdd = comment => {
    this.props.addComment({
      body: comment.body,
      author: comment.author,
      parentId: this.props.post.id
    })
  }

  renderTitle() {
    if (this.props.isEditing) {
      return <h3>{this.props.edited_post.title}</h3>
    }
    return (
      !this.props.isEditing &&
      this.props.post !== null && (
        <div>
          <h3>{this.props.post.title}</h3>
          <p className="valign-wrapper">
            <Icon>alarm</Icon>&nbsp;
            <Moment fromNow>
              {this.props.post.timestamp}
            </Moment>&nbsp;-&nbsp;<Icon>account_circle</Icon>&nbsp;By&nbsp;
            {this.props.post.author}
          </p>
        </div>
      )
    )
  }

  renderBody() {
    if (this.props.isEditing) {
      return (
        <Row>
          <RichEditor
            editorState={this.props.editorState}
            onChange={this.onChange}
          />
        </Row>
      )
    }
    const innerHTML = {
      __html: this.props.post !== null ? this.props.post.body : ''
    }
    return (
      <Row>
        <Col s={12}>
          <p dangerouslySetInnerHTML={innerHTML} />
        </Col>
      </Row>
    )
  }

  renderButton() {
    if (this.props.isEditing) {
      return (
        <Button
          large
          style={{ bottom: '145px', right: '68px' }}
          className="red"
          floating
          fab="vertical"
          waves="light"
          icon="mode_edit"
        >
          <Button
            floating
            className="green darken-1"
            onClick={this.save}
            waves="light"
            disabled={this.props.edited_post === this.props.post}
          />
          <Button
            floating
            className="red darken-1"
            onClick={this.cancel}
            waves="light"
          />
        </Button>
      )
    }

    return [
      <Button
        style={{ left: '100px', position: 'absolute' }}
        floating
        className="green darken-1"
        onClick={this.startEditing}
        waves="light"
        icon="mode_edit"
      />,
      <Button
        style={{ position: 'absolute' }}
        floating
        onClick={this.onDelete}
        className="red darken-1"
        icon="delete"
      />
    ]
  }

  renderCommentBox() {
    if (!this.props.isEditing) {
      return (
        <Row>
          <Col s={12}>
            <Collapsible popout>
              <CollapsibleItem header="Add a new comment" icon="add">
                <CommentBox onAdd={this.onCommentAdd} />
              </CollapsibleItem>
            </Collapsible>
          </Col>
        </Row>
      )
    }
  }

  renderCommentList() {
    return (
      <CommentList
        onVoteUp={this.onCommentUpVote}
        onVoteDown={this.onCommentDownVote}
        comments={this.props.comments}
        onEdit={this.onCommentEdit}
        onDelete={this.onCommentDelete}
        onStartEditing={this.onCommentStartEditing}
        onEndEditing={this.onCommentEndEditing}
        onSortChange={this.onSortChange}
      />
    )
  }

  onCommentUpVote(id) {
    this.props.upVoteComment(id)
  }

  onCommentDownVote(id) {
    this.props.downVoteComment(id)
  }

  onCommentStartEditing = isEditing => {
    this.setState(state => ({
      ...state,
      isEditing
    }))
  }
  onCommentEndEditing = isEditing => {
    this.setState(state => ({ ...state, isEditing }))
  }

  onCommentEdit = comment => {
    console.log('Edit comment', comment)
  }

  onCommentDelete = comment => {
    console.log('Delete comment', comment)
  }

  onSortChange(sortOptions) {
    this.props.sortComments(this.props.postId, sortOptions)
  }

  _leave = e => {
    e.preventDefault()

    let leave = true

    if (this.props.isEditing) {
      leave = window.confirm(
        'You are currently editing this post, Are you sure you want to leave and loose made changes ?'
      )
    }

    if (leave) {
      this.props.editPost(null)
      this.props.goBack()
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col s={12}>
            {this.renderButton()}
            <a href="#back" onClick={this._leave}>
              <Icon left>navigate_before</Icon> Back
            </a>
          </Col>

          <Col s={12}>
            {this.renderTitle()}
            {this.renderBody()}

            {this.renderCommentBox()}
            {this.renderCommentList()}
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ editorState, posts, comments }, props) {
  console.log(props)
  const { postId } = props.match.params
  const { post, edited_post, isEditing } = posts
  const { all: allComments } = comments
  return {
    isEditing,
    editorState,
    post,
    edited_post,
    postId,
    comments:
      !!allComments && !!allComments[postId]
        ? Object.keys(allComments[postId]).map(k => allComments[postId][k])
        : []
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        editPost,
        initEditorWithContent,
        updateEditorState,
        updatePost,
        fetchPost,
        deletePost,
        fetchComments,
        addComment,
        editComment,
        upVoteComment,
        downVoteComment,
        sortComments,
        goBack
      },
      dispatch
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails)
