import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Col, Row, Card, Icon } from 'react-materialize'
import PostStats from './PostStats'
import Vote from './shared/Vote'
import Moment from 'react-moment'

class PostItem extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    onVoteDown: PropTypes.func.isRequired,
    onVoteUp: PropTypes.func.isRequired
  }

  render() {
    const { post, onVoteDown, onVoteUp } = this.props
    const innerHTML = {
      __html: post.body
    }
    return (
      <Row>
        <Col className="hide-on-small-only" m={1}>
          <Vote
            style={{ position: 'relative', top: '1rem' }}
            iconUp={<Icon medium>expand_less</Icon>}
            iconDown={<Icon medium>expand_more</Icon>}
            count={post.voteScore}
            onVoteDown={() => onVoteDown(post)}
            onVoteUp={() => onVoteUp(post)}
          />
        </Col>
        <Col s={12} m={11}>
          <Card
            actions={[
              <Link
                to={`/p/${post.id}`}
                key="button"
                className="waves-effect waves-light btn cyan darken-1"
              >
                Read More<Icon right>chevron_right</Icon>
              </Link>,
              <PostStats
                key="stats"
                voteScore={post.voteScore}
                commentCount={post.commentCount || 0}
              />
            ]}
          >
            <Vote
              style={{
                fontSize: '14px',
                position: 'absolute',
                top: '1em',
                right: 0
              }}
              className="hide-on-med-and-up"
              iconUp={<Icon small>expand_less</Icon>}
              iconDown={<Icon small>expand_more</Icon>}
              count={post.voteScore}
              onVoteDown={() => onVoteDown(post)}
              onVoteUp={() => onVoteUp(post)}
            />
            <h5>{post.title}</h5>
            <p style={{ padding: '5px 0 20px 0' }} className="valign-wrapper">
              <Icon>alarm</Icon>&nbsp;
              <Moment fromNow>{post.timestamp}</Moment>&nbsp;-&nbsp;<Icon>account_circle</Icon>&nbsp;By&nbsp;
              {post.author}
            </p>
            <div dangerouslySetInnerHTML={innerHTML} />
          </Card>
        </Col>
      </Row>
    )
  }
}

export default PostItem
