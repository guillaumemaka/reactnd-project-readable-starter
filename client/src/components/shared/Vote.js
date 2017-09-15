import React, { Component } from 'react'
import PropTypes from 'prop-types'
import iconDownSvg from './vote-down.svg'
import iconUpSvg from './vote-up.svg'

import './Vote.css'

class Vote extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    onVoteDown: PropTypes.func.isRequired,
    onVoteUp: PropTypes.func.isRequired,
    iconUp: PropTypes.element,
    iconDown: PropTypes.element
  }

  _onVoteUp(e) {
    e.preventDefault()
    this.props.onVoteUp()
  }

  _onVoteDown(e) {
    e.preventDefault()
    this.props.onVoteDown()
  }

  _renderIconDown() {
    const { iconDown } = this.props
    if (iconDown) {
      return iconDown
    }

    return <img src={iconDownSvg} alt="Down" />
  }

  _renderIconUp() {
    const { iconUp } = this.props
    if (iconUp) {
      return iconUp
    }

    return <img src={iconUpSvg} alt="Up" />
  }

  render() {
    const { count, className } = this.props
    let classes = ['Vote']

    if (className) {
      classes = classes.concat(className.split(' '))
    }

    return (
      <div style={this.props.style} className={classes.join(' ')}>
        <div className="Vote__Up">
          <a href="#up" onClick={this._onVoteUp.bind(this)} alt="Vote Up">
            {this._renderIconUp()}
          </a>
        </div>
        <div className="Vote__Count">{count}</div>
        <div className="Vote__Down">
          <a href="#down" onClick={this._onVoteDown.bind(this)} alt="Vote Down">
            {this._renderIconDown()}
          </a>
        </div>
      </div>
    )
  }
}

export default Vote
