import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { newPassword } from '../templates/common/authModals/modalTypes'

class ValidateRoute extends Component {
	state = {
		isChecked: false,
		modalType: null
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
		// 		'onebenefactor.powercode.pro://reset-password/' +
		// 		this.props.match.params.token
		// } else {
			this.setState({
				isChecked: true,
				modalType: newPassword
			})
		// }
	}

	render() {
		if (this.state.isChecked && this.state.modalType) {
			let modal = `?modal=${newPassword}&token=${
				this.props.match.params.token
			}`
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

export default withRouter(connect()(ValidateRoute))
