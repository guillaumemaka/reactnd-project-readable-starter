import React, { Component } from 'react'
import { Col, Button, Row, Icon, Input } from 'react-materialize'
import { connect } from 'react-redux'
import {
  fetchCategories,
  createPost,
  onNewPostChange,
  updateEditorState
} from '../actions'
import { Link } from 'react-router-dom'
import RichEditor from '../components/RichEditor'

class PostCreate extends Component {
  state = {
    errors: {}
  }

  componentDidMount() {
    if (!this.props.categories.length) {
      this.props.fetchCategories()
    }
  }

  _onInputChange = e => {
    if (e.target.value) {
      this.props.onNewPostChange({
        ...this.props.new_post,
        [e.target.name]: e.target.value
      })
    }
  }

  _onEditorChange = editorState => {
    this.props.updateEditorState(editorState, 'create')
  }

  onSubmit = e => {
    e.preventDefault()

    const { new_post } = this.props
    const { category } = new_post

    const errors = ['author', 'body', 'title'].reduce((errors, field) => {
      if (!new_post[field]) {
        errors[field] = `${field} can't be blank!`
      }

      return errors
    }, {})

    if (category === 'none') {
      errors.category = 'Please select a category!'
    }

    if (Object.keys(errors) > 0) {
      this.setState({ errors })
    } else {
      this.props.createPost(new_post)
    }

    return false
  }

  render() {
    const { errors } = this.state
    return (
      <Row>
        <Col s={12}>
          <Row>
            <Link to="/">
              <Icon left>navigate_before</Icon> Home
            </Link>
          </Row>
          <Row>
            <h4>Create a new Post</h4>
          </Row>
          <Row>
            <form onSubmit={this.onSubmit}>
              <Row>
                <Input
                  s={12}
                  placeholder="Post title"
                  label="Post title"
                  onChange={this._onInputChange}
                  name="title"
                  type="text"
                  error={errors.title && errors.title}
                />
              </Row>
              <Row>
                <Input
                  s={12}
                  placeholder="Post author name"
                  label="Post author name"
                  onChange={this._onInputChange}
                  name="author"
                  type="text"
                  error={errors.author && errors.author}
                />
              </Row>

              <Row>
                <Input
                  s={12}
                  name="category"
                  type="select"
                  label="Select a category"
                  defaultValue="none"
                  onChange={this._onInputChange}
                >
                  <option key="none" value="none">
                    Select a category
                  </option>
                  {this.props.categories.map(c => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Input>
              </Row>
              <Row>
                <Col s={12}>
                  <RichEditor
                    editorState={this.props.editorState}
                    onChange={this._onEditorChange}
                  />
                  <span className="red-text">{errors.body && errors.body}</span>
                </Col>
              </Row>
              <Button
                type="submit"
                className="col s12 m2 right cyan darken-1"
                waves="light"
              >
                <Icon left>check</Icon> Create
              </Button>
            </form>
          </Row>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({ editorState, posts, categories }) {
  const { new_post } = posts
  return {
    editorState,
    new_post,
    categories
  }
}

export default connect(mapStateToProps, {
  createPost,
  updateEditorState,
  fetchCategories,
  onNewPostChange
})(PostCreate)
