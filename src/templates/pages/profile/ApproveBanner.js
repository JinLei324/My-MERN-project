import React, { Component } from 'react'
import { connect } from 'react-redux'
import Card from '../../common/Card'
import { NONE, PENDING, CANCELLED, APPROVED, DECLINED } from '../../../helpers/userStatus'
import { NavLink } from 'react-router-dom'
import VerificationModal from '../Dashboard/VerificationModal'

import {
	cancelVerification,
	shownApproveMessage
} from '../../../actions/user'

class ApproveBanner extends Component {
	state = {
		showVerificationModal: false
	}

	openSubmitModal = e => {
		e.preventDefault()
		this.setState({showVerificationModal: true})
	}

	closeSubmitModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showVerificationModal: false })
		}
	}

	forceCloseVerificationModal = e => {
		this.setState({ showVerificationModal: false })
	}

	cancelVerification = e => {
		e.preventDefault()
		this.props.cancelVerification()
	}

	closeApproveMessage = () => {
		this.props.shownApproveMessage()
	}

	render() {
		const {
			showVerificationModal
		} = this.state

		const {
			user
		} = this.props

		return(
			<Card className={`ApproveBanner contentWrapper`}>
				<div className="VerificationModal"><VerificationModal showModal={showVerificationModal} afterSubmit={this.forceCloseVerificationModal} /></div>
				<div className="message">
					{user && user.status === NONE &&
						<p className="main-font">
							Your profile was completed 50%. Please <NavLink to="/" onClick={this.openSubmitModal}>submit</NavLink> the verification documents to complete your profile. Only after that, you can create the projects.
						</p>
					}
					{user && user.status === PENDING &&
						<p className="main-font">
							We are reviewing your documents now. Please wait until it will be approved. It will take 24-48 hours. Your profile was completed 80%. Please <NavLink to="/" onClick={this.cancelVerification}>click here</NavLink> to cancel the verification process.
						</p>
					}
					{user && user.status === CANCELLED &&
						<p className="main-font">
							You cancelled your verification. Please <NavLink to="/" onClick={this.openSubmitModal}>submit</NavLink> the verification documents to complete your profile. Only after that, you can create the projects.
						</p>
					}
					{user && user.status === APPROVED &&
						<p className="main-font hasCloseBtn">
							Your account was successfully verified. <span className="closeBtn" onClick={this.closeApproveMessage}></span>
						</p>
					}
					{user && user.status === DECLINED &&
						<p className="main-font">
							Your verification document has been decliend. Please <NavLink to="/" onClick={this.openSubmitModal}>submit</NavLink> the verification documents to complete your profile. Only after that, you can create the projects.
						</p>
					}
				</div>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
	cancelVerification,
	shownApproveMessage
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApproveBanner)