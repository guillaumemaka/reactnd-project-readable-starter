import React, { Component } from 'react'
import { Row, Col, Collection } from 'react-materialize'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  fetchCategories,
  fetchPosts,
  sortPosts,
  upVotePost,
  downVotePost
} from '../actions'
import PostsList from '../components/PostList'
import { Loader } from 'react-loaders'

class PostsIndex extends Component {
  componentWillMount() {
    this.props.fetchCategories()
    this.props.fetchPosts()
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
  fetchPosts,
  upVotePost,
  downVotePost,
  sortPosts
})(PostsIndex)
