import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearNotification } from '../actions'
import Alert from 'react-s-alert'
import PropTypes from 'prop-types'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

class NotificationCenter extends Component {
  static propTypes = {
    message: PropTypes.string,
    position: PropTypes.string,
    offset: PropTypes.number,
    stack: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    effect: PropTypes.string,
    beep: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool
    ]),
    timeout: PropTypes.oneOfType([PropTypes.oneOf(['none']), PropTypes.number]),
    html: PropTypes.bool,
    onClose: PropTypes.func,
    onShow: PropTypes.func,
    customFields: PropTypes.object,
    contentTemplate: PropTypes.func
  }

  componentDidUpdate(prevProps, prevState) {
    const alertOptions = this.props
    this.props.notifications.forEach(n => {
      switch (n.category) {
        case 'error':
          Alert.error(n.message, alertOptions)
          break
        case 'success':
          Alert.success(n.message, alertOptions)
          break
        case 'warning':
          Alert.warning(n.message, alertOptions)
          break
        case 'info':
          Alert.info(n.message, alertOptions)
          break
        default:
          console.log('Unknown')
          break
      }

      setTimeout(() => {
        this.props.clearNotification(n.id)
      }, alertOptions.timeout + 1000)
    })
  }

  render() {
    return <Alert {...this.props} />
  }
}

function mapStateToProps({ notifications }) {
  return { notifications }
}

export default connect(mapStateToProps, { clearNotification })(
  NotificationCenter
)
