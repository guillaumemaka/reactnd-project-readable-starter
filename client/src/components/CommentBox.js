import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Input, Button, Icon } from 'react-materialize'
import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import RichEditor from './RichEditor'

class CommentBox extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    comment: {}
  }

  componentDidMount() {
    if (!!this.props.author) {
      this.setState(state => ({
        ...state,
        comment: {
          ...state.comment,
          author: this.props.author
        }
      }))
    }
  }

  onEditorStateChange = editorState => {
    this.setState({
      ...this.state,
      editorState,
      comment: {
        ...this.state.comment,
        body: stateToHTML(editorState.getCurrentContent())
      }
    })
  }

  onAdd = e => {
    e.preventDefault()
    this.props.onAdd(this.state.comment)
    this.clear()
  }

  onCancel = e => {
    e.preventDefault()
    this.clear()
  }

  clear = () => {
    this.setState({
      editorState: EditorState.createEmpty(),
      comment: {}
    })
  }

  onInputChange = e => {
    this.setState({
      ...this.state,
      comment: {
        ...this.state.comment,
        [e.target.name]: e.target.value
      }
    })
  }

  render() {
    return (
      <Row>
        <form>
          <Row>
            <Col s={12}>
              <Input
                s={12}
                onChange={this.onInputChange}
                name="author"
                placeholder="Author name"
                label="Author name"
                disabled={!!this.props.author}
                value={
                  !!this.state.comment.author ? this.state.comment.author : ''
                }
              >
                <Icon>account_circle</Icon>
              </Input>
            </Col>
          </Row>
          <Row>
            <Col s={12}>
              <RichEditor
                editorState={this.state.editorState}
                placeholder="Your comment..."
                onChange={this.onEditorStateChange}
              />
            </Col>
          </Row>
          <Row className="right">
            <Col>
              <Button className="white black-text" onClick={this.onCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button onClick={this.onAdd}>Comment</Button>
            </Col>
          </Row>
        </form>
      </Row>
    )
  }
}

CommentBox.propTypes = {
  onAdd: PropTypes.func.isRequired,
  author: PropTypes.string
}

export default CommentBox
