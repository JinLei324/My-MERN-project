import React, { Component } from 'react'
import axios from '../helpers/axiosApi'
import { Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { history } from '../store'
import { connect } from 'react-redux'
import { toggleNotification } from '../actions/notificationActions'
import serverErrors from '../helpers/serverErrors'

class NewEmailRoute extends Component {
	state = {
		isChecked: false
	}

	componentDidMount() {
		// const isMobile =
		// 	typeof window.orientation !== 'undefined' ||
		// 	navigator.userAgent.indexOf('IEMobile') !== -1

		// const iOS =
		// 	!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)

		// if (isMobile && iOS) {
		// 	setTimeout(function() {
		// 		window.location = 'itms-apps://itunes.apple.com/'
		// 	}, 25)

		// 	window.location =
		// 		'onebenefactor.powercode.pro://change-email/' +
		// 		this.props.match.params.token
		// } else {
		axios
			.post('/user/new-email/' + this.props.match.params.token)
			.then(res => {
				this.setState({
					isChecked: true
				})
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
		if (this.state.isChecked) {
			return (
				<Redirect
					to={{
						pathname: '/discovery'
					}}
				/>
			)
		}
		return <div>Matching</div>
	}
}

export default connect()(withRouter(NewEmailRoute))
