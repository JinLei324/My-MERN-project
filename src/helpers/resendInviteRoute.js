import React, { Component } from 'react'
import axios from '../helpers/axiosApi'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { history } from '../store'
import { connect } from 'react-redux'
import { toggleNotification } from '../actions/notificationActions'

import serverErrors from '../helpers/serverErrors'

class ResendInviteRoute extends Component {
  state = {
    isChecked: false,
    modalType: null
  }

  componentDidMount() {
    // const isMobile =
    //   typeof window.orientation !== 'undefined' ||
    //   navigator.userAgent.indexOf('IEMobile') !== -1

    // const iOS =
    //   !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)

    // if (isMobile && iOS) {
    //   setTimeout(function() {
    //     window.location = 'itms-apps://itunes.apple.com/'
    //   }, 25)

    //   window.location =
    //     'onebenefactor.powercode.pro://account-verify/' +
    //     this.props.match.params.token
    // } else {
      axios
        .post(
          '/invites/resend',
          {
            token: this.props.match.params.token
          }
        )
        .then(res => {
          history.push('/')
          this.props.dispatch(
            toggleNotification({
              isOpen: true,
              resend: false,
              firstTitle: 'Sucess',
              secondTitle:'Invitation email was resent.',
              buttonText: 'Ok'
            })
          )
        })
        .catch(error => {
          history.push('/')
          this.props.dispatch(
            toggleNotification({
              isOpen: true,
              resend: false,
              firstTitle: 'Error',
              secondTitle:
                serverErrors[
                  error.response.headers['x-code-error']
                ] ||
                serverErrors[error.response.status] ||
                error.message,
              buttonText: 'Ok'
            })
          )
        })
    // }
  }
  render() {
    if (this.state.isChecked && this.state.modalType) {
      let modal = `?modal=${this.state.modalType}`
      return (
        <Redirect
          to={{
            pathname: '/discovery',
            search: modal
          }}
        />
      )
    }
    return <div>Matching</div>
  }
}

export default connect()(withRouter(ResendInviteRoute))
