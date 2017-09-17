import React, { Component } from 'react'
import { Col, Button, Row, Icon, Input } from 'react-materialize'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { fetchCategories, createPost, setAuthorIfNotPresent } from '../actions'
import { Link } from 'react-router-dom'
import RichEditor from '../components/RichEditor'
import { stateToHTML } from 'draft-js-export-html'

class PostCreate extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    errors: {},
    post: {}
  }

  componentDidMount() {
    if (!this.props.categories.length) {
      this.props.fetchCategories()
    }

    if (!!this.props.authorName) {
      this.setState({
        post: {
          ...this.state.post,
          author: this.props.authorName
        }
      })
    }
  }

  _onInputChange = e => {
    if (e.target.value) {
      this.setState({
        post: {
          ...this.state.post,
          [e.target.name]: e.target.value
        }
      })
    }
  }

  _onEditorChange = editorState => {
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

  onSubmit = e => {
    e.preventDefault()

    const { post } = this.state
    const { category } = post

    const errors = ['author', 'body', 'title'].reduce((errors, field) => {
      if (!post[field] || post[field] === '') {
        errors[field] = `${field} can't be blank!`
      }

      return errors
    }, {})

    if (!category || category === 'none') {
      errors.category = 'Please select a category!'
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors })
    } else {
      this.props.createPost(post)
      this.props.setAuthorIfNotPresent(post.author)
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
                  type="text"
                  s={12}
                  placeholder="Post title"
                  label="Post title"
                  onChange={this._onInputChange}
                  name="title"
                />
                <p className="red-text darken-1 right-align">
                  {!!errors.title && errors.title}
                </p>
              </Row>
              <Row>
                <Input
                  type="text"
                  s={12}
                  placeholder="Post author name"
                  label="Post author name"
                  onChange={this._onInputChange}
                  name="author"
                  defaultValue={this.props.authorName}
                  disabled={!!this.props.authorName}
                />
                <p className="red-text darken-1 right-align">
                  {!!errors.author && errors.author}
                </p>
                {!this.props.authorName && (
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
              </Row>

              <Row>
                <Input
                  type="select"
                  s={12}
                  name="category"
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
                <p className="red-text darken-1 right-align">
                  {!!errors.category && errors.category}
                </p>
              </Row>
              <Row>
                <Col s={12}>
                  <RichEditor
                    editorState={this.state.editorState}
                    onChange={this._onEditorChange}
                  />
                  <p className="red-text darken-1 right-align">
                    {!!errors.body && errors.body}
                  </p>
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
  const { new_post, authorName } = posts
  return {
    authorName,
    editorState,
    new_post,
    categories
  }
}

export default connect(mapStateToProps, {
  createPost,
  fetchCategories,
  setAuthorIfNotPresent
})(PostCreate)
