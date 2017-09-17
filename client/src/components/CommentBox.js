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
    if (this.props.author) {
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
        body: editorState.getCurrentContent().hasText()
          ? stateToHTML(editorState.getCurrentContent())
          : ''
      }
    })
  }

  onAdd = e => {
    e.preventDefault()
    this.props.onAdd(this.state.comment)
    this.clear()
  }

  clear = () => {
    this.setState({
      editorState: EditorState.createEmpty(),
      comment: {
        ...this.state.comment,
        body: ''
      }
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
              {!this.props.author && (
                <Input
                  type="text"
                  s={12}
                  onChange={this.onInputChange}
                  name="author"
                  placeholder="Author name"
                  label="Author name"
                  disabled={!!this.props.author}
                  defaultValue={this.props.author}
                >
                  <Icon>account_circle</Icon>
                </Input>
              )}
              {this.props.author && (
                <div>
                  <span className="valign-wrapper">
                    <Icon>account_circle</Icon>&nbsp;{this.props.author}
                  </span>
                </div>
              )}
              {!this.state.comment.author && (
                <span>
                  <em>
                    <strong className="cyan-text darken-1">
                      You haven'yet posted anything, please choose your author
                      name, note that author name will be use through the
                      application and cannot be changed, so choose wisely.
                    </strong>
                  </em>
                </span>
              )}
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
              <Button
                onClick={this.onAdd}
                disabled={
                  !(this.state.comment.author && this.state.comment.body)
                }
              >
                Comment
              </Button>
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
