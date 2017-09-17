import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  updatePost,
  upVotePost,
  downVotePost,
  fetchPost,
  deletePost,
  fetchComments,
  addComment,
  editComment,
  deleteComment,
  upVoteComment,
  downVoteComment,
  sortComments,
  setAuthorIfNotPresent
} from '../actions'

import { Card, Col, Row, Button, Icon } from 'react-materialize'
import { goBack } from 'react-router-redux'
import { EditorState } from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'
import { stateToHTML } from 'draft-js-export-html'

import RichEditor from '../components/RichEditor'
import CommentBox from '../components/CommentBox'
import CommentList from '../components/CommentList'
import Moment from 'react-moment'
import Vote from '../components/shared/Vote'

class PostDetails extends Component {
  state = {
    isEditing: false,
    isEditingComment: false,
    editorState: EditorState.createEmpty(),
    post: {},
    errors: {}
  }

  /**
   * Lifecycle methods
   */

  componentWillMount() {
    const { postId } = this.props
    this.props.fetchPost(postId)
    this.props.fetchComments(postId)
  }

  /**
   * Event handlers
   */

  startEditing = e => {
    e.preventDefault()
    const { post } = this.props
    this.setState({
      isEditing: true,
      editorState: EditorState.createWithContent(stateFromHTML(post.body)),
      post
    })
  }

  endEditing = () => {
    this.setState({
      isEditing: false,
      editorState: EditorState.createEmpty(),
      post: {},
      errors: {}
    })
  }

  onEditorChange = editorState => {
    this.setState({
      editorState,
      post: {
        ...this.state.post,
        body: editorState.getCurrentContent().hasText()
          ? stateToHTML(editorState.getCurrentContent())
          : ''
      }
    })
  }

  onDelete = e => {
    e.preventDefault()
    const { post } = this.props
    const confirm = window.confirm(`Are you sure to delete ${post.title}`)
    if (confirm) {
      this.props.deletePost(post)
    }
  }

  save = e => {
    e.preventDefault()
    const { post } = this.state
    const errors = {}

    if (post.body === '') {
      errors.body = "Body can't be blank!"
    }

    if (Object.keys(errors).length > 0) {
      this.setState({
        errors
      })
    } else {
      this.props.updatePost(this.state.post)
      this.endEditing()
    }

    return false
  }

  cancel = e => {
    e.preventDefault()
    this.endEditing()
  }

  onCommentAdd = comment => {
    this.props.addComment({
      body: comment.body,
      author: comment.author,
      parentId: this.props.post.id
    })
    this.props.setAuthorIfNotPresent(comment.author)
  }

  onPostUpVote = () => {
    this.props.upVotePost(this.props.post)
  }

  onPostDownVote = () => {
    this.props.downVotePost(this.props.post)
  }

  onCommentUpVote = comment => {
    this.props.upVoteComment(comment)
  }

  onCommentDownVote = comment => {
    this.props.downVoteComment(comment)
  }

  onCommentStartEditing = isEditingComment => {
    this.setState(state => ({
      ...state,
      isEditingComment
    }))
  }
  onCommentEndEditing = isEditingComment => {
    this.setState(state => ({
      ...state,
      isEditingComment
    }))
  }

  onCommentEdit = comment => {
    this.props.editComment(comment)
  }

  onCommentDelete = comment => {
    if (window.confirm('Do you realy want to delete this comment?')) {
      this.props.deleteComment(comment)
    }
  }

  onCommentCheckOwnership = comment => {
    return this.props.authorName === comment.author
  }

  onSortChange = sortOptions => {
    this.props.sortComments(this.props.postId, sortOptions)
  }

  _leave = e => {
    e.preventDefault()

    let leave = true

    if (this.state.isEditing || this.state.isEditingComment) {
      leave = window.confirm(
        'You are currently editing this post, Are you sure you want to leave and loose made changes ?'
      )
    }

    if (leave) {
      this.props.goBack()
    }
  }

  _checkPostOwnership = () => {
    const { post, authorName } = this.props
    return post && post.author === authorName
  }

  /**
   * Rendering helpers
   */

  renderTitle() {
    const { post } = this.props
    if (this.state.isEditing) {
      return <h3> {post.title} </h3>
    }
    return (
      post !== null && (
        <div>
          <h3>{post && post.title}</h3>
          <p className="valign-wrapper">
            <Icon> alarm </Icon>&nbsp;
            <Moment fromNow>{post && post.timestamp}</Moment>&nbsp;-&nbsp;<Icon>account_circle</Icon>
            &nbsp; By&nbsp;{post && post.author}
          </p>
        </div>
      )
    )
  }

  renderBody() {
    if (this.state.isEditing) {
      return (
        <Row>
          <Col s={12}>
            <RichEditor
              editorState={this.state.editorState}
              onChange={this.onEditorChange}
            />
            {this.state.errors.body && (
              <p className="right-align red-text darken-1">
                {this.state.errors.body}
              </p>
            )}
          </Col>
        </Row>
      )
    }

    const { post } = this.props
    const innerHTML = {
      __html: post ? post.body : ''
    }
    return (
      <Row>
        <Col s={12}>
          <p
            style={{
              padding: '20px 0'
            }}
            dangerouslySetInnerHTML={innerHTML}
          />{' '}
        </Col>{' '}
      </Row>
    )
  }

  renderButton() {
    const { post } = this.props
    if (this.state.isEditing) {
      return [
        <Button
          style={{
            marginRight: '10px'
          }}
          key="save"
          className="green darken-1"
          onClick={this.save}
          waves="light"
          disabled={this.state.post === post}
        >
          Save{' '}
        </Button>,
        <Button
          key="cancel"
          className="red darken-1"
          onClick={this.cancel}
          waves="light"
        >
          Cancel{' '}
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
        <Icon> mode_edit </Icon>{' '}
      </a>,

      <a
        key="delete"
        className="red-text darken-1"
        href="#delete"
        onClick={this.onDelete}
      >
        <Icon> delete </Icon>{' '}
      </a>
    ]
  }

  renderCommentBox() {
    if (!this.state.isEditing) {
      return (
        <Row>
          <Col s={12}>
            <Card title="Add a comment">
              <CommentBox
                onAdd={this.onCommentAdd}
                author={this.props.authorName}
              />
            </Card>
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
        checkOwnership={this.onCommentCheckOwnership}
      />
    )
  }

  render() {
    const { post } = this.props
    return (
      <div>
        <Row>
          <Col s={12}>
            <a href="#back" onClick={this._leave}>
              <Icon left> navigate_before </Icon> Back{' '}
            </a>{' '}
          </Col>
          <Col s={12}>
            <Col m={1} className="hide-on-small-only">
              <Vote
                iconUp={<Icon small> expand_less </Icon>}
                iconDown={<Icon small> expand_more </Icon>}
                count={(post && post.voteScore) || 0}
                onVoteDown={this.onPostDownVote}
                onVoteUp={this.onPostUpVote}
              />{' '}
            </Col>{' '}
            <Col s={12} m={11}>
              <Card
                actions={this._checkPostOwnership() ? this.renderButton() : []}
              >
                <Vote
                  style={{
                    fontSize: '14px',
                    position: 'absolute',
                    top: '1em',
                    right: '0.25em'
                  }}
                  className="hide-on-med-and-up"
                  iconUp={<Icon small> expand_less </Icon>}
                  iconDown={<Icon small> expand_more </Icon>}
                  count={(post && post.voteScore) || 0}
                  onVoteDown={this.onPostDownVote}
                  onVoteUp={this.onPostUpVote}
                />
                {this.renderTitle()} {this.renderBody()}
              </Card>
              {this.renderCommentBox()} {this.renderCommentList()}
            </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps({ posts, comments }, props) {
  const { postId } = props.match.params
  const { authorName, post } = posts
  const { all: allComments } = comments
  return {
    authorName,
    post,
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
        updatePost,
        fetchPost,
        deletePost,
        upVotePost,
        downVotePost,
        fetchComments,
        addComment,
        editComment,
        deleteComment,
        upVoteComment,
        downVoteComment,
        sortComments,
        setAuthorIfNotPresent,
        goBack
      },
      dispatch
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails)
