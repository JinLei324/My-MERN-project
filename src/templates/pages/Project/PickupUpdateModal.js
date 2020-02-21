import React, { Component } from 'react'
import { connect } from 'react-redux'
import Geocode from 'react-geocode'
import moment from 'moment'
import {
	togglePreloader
} from '../../../actions/preloader'
import {
	updatePickupRequest
} from '../../../actions/project'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Card from '../../common/Card'
// import { history } from '../../../store'

library.add(faCheck);

Geocode.setApiKey('AIzaSyDuMQs00SaxXjB7pQz0cwIGj-3gIVZYOGI&libraries')

class PickupUpdateModal extends Component {
	state = {
		step: 0,
		pickupDays: [],
		request: {}
	}

	updatePickupRequest = () => {
		this.props.updatePickupRequest(this.state.request)
	}

	changeRequestValue = ({ target }) => {
		let request = this.state.request
		request.value = target.value
		this.setState({ request })
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.preloader.actionName === 'updatePickupRequest' && nextProps.preloader.show === false) {
			this.setState({ step: 1 })
		}
		if (nextProps.request) {
			let request = nextProps.request
			let pickupDate = moment.unix(request.pickupDate)
			request.pickupDate = pickupDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix()
			this.setState({ request: request })
		}
		if (nextProps.project) {
			let t_weekday = moment().weekday(), n_weekday
			let pickupDays = []
			if (nextProps.project.pickupDays) {
				pickupDays = nextProps.project.pickupDays.map((p) => {
					n_weekday = t_weekday < p ? p : p + 7
					return moment().set({day: n_weekday, hour: 0, minute: 0, second: 0, millisecond: 0}).unix()
				})
			}

			pickupDays.sort()

			this.setState({ pickupDays })
		}
	}

	handleClose = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.clearForm()
			this.props.handleClose()
		}
	}

	clearForm = () => {
		this.setState({ step: 0, request: {} })
	}

	selectPickupDate = date => {
		let request = this.state.request
		request.pickupDate = date
		this.setState({ request });
	}

	getPickupdayLabel = date => {
		return moment.unix(date).format('dddd Do');
	}

	viewRequests = () => {
		// history.push(`/${this.props.user._id}/projects`);
		this.done();
	}

	done = () => {
		this.clearForm()
		this.props.togglePreloader({ show: true, actionName: '' })
		this.props.handleClose()
	}

	render() {
		const {
			step,
			pickupDays,
			request
		} = this.state

		const {
			//project,
			need
		} = this.props

		let proc = 0
		if (need) {
			proc = (need.current / need.of) * 100
		}

		return (
			<Modal className="donationModal" showModal={this.props.showModal} closeModal={this.handleClose} width="430px" padding="40px 30px">
				{step === 0 && <div>
					<div className="text-center"><label>What items would you like to donate?</label></div>
					<div className="separator-30"></div>
					<div className="donationModal">
						<div className="needList">
							{need && request &&
								<div
									key={`${need.of}`}
									className={`activiti-wrapper ${
										need.total_applicants === 0 ? 'empty' : ''
									} ${proc >= 100 ? 'full' : ''}`}>
									<div className="flex-wrapper">
										<div className="progressBar">
											<p className="needName">{need.value}</p>
											<div className="progress-wrapper">
												<div className="values">
													<span className="current">{need.current}</span><span className="of text-right">{need.of}</span>
												</div>
												<div
													className="progress">
													<div
														className="progress-contain"
														style={{
															width: `${
																proc > 100
																	? 100
																	: proc
															}%`
														}}
													/>
												</div>
											</div>
										</div>
										<div className="donate-input">
											<input type="number" name="donationValue" min="0" placeholder="0" className="donationValue" onChange={this.changeRequestValue} value={request.value} />
										</div>
									</div>
								</div>
							}
						</div>
						<label className="title">Your pickup location</label>
						<p>{ request.address }</p>
						<div className="separator-30"></div>
						<label className="title">Select a day</label>
						<p>Nonprofits have selected their availability in which they can PickUp from your location. Please select a day you'd like for the nonprofit to PickUp your donation items.</p>
						<div className="separator-30"></div>
						<div className="">
							{pickupDays && pickupDays.map((p, i) => (
								<span key={`pickup-${i}`} className={`pickupDay ${p === request.pickupDate ? 'selected' : ''}`} onClick={() => this.selectPickupDate(p)}>{this.getPickupdayLabel(p)}</span>
							))}
						</div>
						<div className="separator-30"></div>
						<div className="give-button">
							<Button label={'Request PickUp'} onClick={() => this.updatePickupRequest()} solid/>
						</div>
					</div>
				</div>}
				{step === 1 && <div>
					<div className="text-center">
						<div className="separator-30"></div>
						<div className="success-box">
							<FontAwesomeIcon icon="check" className="_icon" />
						</div>
						<div className="separator-30"></div>
						<p className="success-text">All done! Your PickUp Request was successfully sent!</p>
						<div className="separator-30"></div>
						<Card className="type-wrapper" padding="0">
							<button onClick={() => this.viewRequests()} className={`wrapper animation-click-effect`}><span>View My Request</span></button>
							<button onClick={() => this.done()} className={`wrapper animation-click-effect active`}><span>Done</span></button>
						</Card>
						<div className="separator-30"></div>
					</div>
				</div>}
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	isAuth: state.authentication.isAuth,
	user: state.authentication.user,
	preloader: state.preloader
})

const mapDispatchToProps = {
	updatePickupRequest,
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PickupUpdateModal)