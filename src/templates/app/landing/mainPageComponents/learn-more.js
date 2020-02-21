import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Button from '../../../common/Button'
import ModalSubscribe from './modalSubscribe'
import ModalThankyou from './modalThankyou'
import ModalLearn from './modalLearn'
import { signUp } from '../../../common/authModals/modalTypes'
import {
	clearUserSubscribe
} from '../../../../actions/user'

class LearnMore extends Component {
	state = {
		showSubscribeModal: false,
		showThankyouModal: false,
		showLearnModal: false,
		modalType: "",
		error: ""
	}

	openLearnModal = type => e => {
		this.setState({ showLearnModal: true, modalType: type })
	}

	closeLearnModal = type => e => {
		if (
			e.target.className.includes('modal open') ||
			e.target.className.includes('closeBtn') ||
			e.target.className.includes('closeX')
		) {
			this.setState({ showLearnModal: false }, () => {
				if (type === 'signup') {
					this.props.history.push(`?modal=${signUp}`)
				}
				else if (type === 'learn') {
					this.props.history.push(`learn`)
				}
				else if (type === 'discover') {
					this.props.history.push('discovery')
				}
				else if (type === 'subscribe') {
					this.showSubscribeModal()
				}
			})
		}
	}

	showSubscribeModal = () => {
		this.setState({ showSubscribeModal: true })
	}

	closeSubscribeModal = e => {
		if (
			e.target.className.includes('modal open') ||
			e.target.className.includes('closeBtn') ||
			e.target.className.includes('closeX')
		) {
			this.props.clearUserSubscribe()
			this.setState({ showSubscribeModal: false })
		}
	}

	openThankyouModal = error => {
		if (!error) {
			setTimeout(() => {
				this.setState({ showSubscribeModal: false })
			}, 1000)
		}
		this.setState({ showThankyouModal: true, error })
	}

	closeThankyouModal = e => {
		if (
			e.target.className.includes('modal open') ||
			e.target.className.includes('closeBtn') ||
			e.target.className.includes('closeX')
		) {
			this.props.clearUserSubscribe()
			this.setState({ showThankyouModal: false })
		}
	}
	render() {
		const {
			showSubscribeModal,
			showThankyouModal,
			showLearnModal,
			modalType,
			error
		} = this.state

		return (
			<div className="LearnMore">
				<ModalLearn
					showModal={showLearnModal}
					closeModal={this.closeLearnModal}
					modalType={modalType}
				/>
				<ModalSubscribe
					showModal={showSubscribeModal}
					closeModal={this.closeSubscribeModal}
					openThankyouModal={this.openThankyouModal}
				/>
				<ModalThankyou
					showModal={showThankyouModal}
					closeModal={this.closeThankyouModal}
					error={error}
				/>
				<div className="learnContent">
					<h4 className="text-gradient-blue text-center caption-title">Select a Role to Learn More!</h4>
					<div className="joins">
						<div className="join">
							<img src="/images/ui-icon/landing/nonprofit.png" alt="" />
							<Button padding="8px 24px" inverse label="Nonprofit" className="btnJoin" fontSize="14px" onClick={this.openLearnModal('nonprofit')} />
						</div>
						<div className="join">
							<img src="/images/ui-icon/landing/donor.png" alt="" />
							<Button padding="8px 24px" inverse label="Donor" className="btnJoin" fontSize="14px" onClick={this.openLearnModal('donor')} />
						</div>
						<div className="join">
							<img src="/images/ui-icon/landing/student.png" alt="" />
							<Button padding="8px 24px" inverse label="Student" className="btnJoin" fontSize="14px" onClick={this.openLearnModal('student')} />
						</div>
						<div className="join">
							<img src="/images/ui-icon/landing/business.png" alt="" />
							<Button padding="8px 24px" inverse label="Business" className="btnJoin" fontSize="14px" onClick={this.openLearnModal('business')} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = {
	clearUserSubscribe
}

export default withRouter(
	connect(
		null,
		mapDispatchToProps,
		null,
		{
			pure: false
		}
	)(LearnMore)
)