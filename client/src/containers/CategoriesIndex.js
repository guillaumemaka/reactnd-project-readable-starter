import 'loaders.css/src/animations/ball-clip-rotate.scss'
import React, { Component } from 'react'
import { Icon, Row, Col, Collection } from 'react-materialize'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  fetchCategories,
  fetchPostsByCategory,
  sortPosts,
  upVotePost,
  downVotePost
} from '../actions'
import PostsList from '../components/PostList'
import { Loader } from 'react-loaders'

class CategoriesIndex extends Component {
  componentWillMount() {
    const { category } = this.props.match.params
    this.props.fetchCategories()
    this.props.fetchPostsByCategory(category)
  }

  componentDidUpdate(prevProps, prevState) {
    const prevCategory = prevProps.match.params.category
    const newCategory = this.props.match.params.category
    if (newCategory !== prevCategory)
      this.props.fetchPostsByCategory(newCategory)
  }

  _onSortChange = sortDescriptor => {
    this.props.sortPosts(sortDescriptor)
  }

  _onVoteUp = post => {
    this.props.upVotePost(post)
  }

  _onVoteDown = post => {
    this.props.downVotePost(post)
  }

  render() {
    return (
      <Row>
        <Col m={9} s={12}>
          <Loader
            className="row center"
            type="ball-clip-rotate"
            active={this.props.isFetching}
          />
          <Row>
            <Col s={12}>
              <Link to="/">
                <Icon left>navigate_before</Icon> Home
              </Link>
            </Col>
          </Row>
          {this.props.posts !== [] && (
            <PostsList
              onSortChange={this._onSortChange}
              onVoteDown={this._onVoteDown}
              onVoteUp={this._onVoteUp}
              posts={this.props.posts}
            />
          )}
        </Col>
        <Col m={3} s={12}>
          <Collection header="Categories">
            {this.props.categories &&
              this.props.categories.map(c => {
                return (
                  <NavLink
                    className="collection-item"
                    exact
                    key={c.path}
                    to={`/categories/${c.path}`}
                  >
                    {c.name}
                  </NavLink>
                )
              })}
          </Collection>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({ posts, categories }) {
  const { all: allPosts, isFetching } = posts
  return {
    categories,
    isFetching,
    posts: Object.keys(allPosts).reduce((prev, key) => {
      prev.push(allPosts[key])
      return prev
    }, [])
  }
}

export default connect(mapStateToProps, {
  fetchCategories,
  fetchPostsByCategory,
  upVotePost,
  downVotePost,
  sortPosts
})(CategoriesIndex)
