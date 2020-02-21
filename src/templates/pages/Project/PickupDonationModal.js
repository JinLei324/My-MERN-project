import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Geocode from 'react-geocode'
import moment from 'moment'
import {
	togglePreloader
} from '../../../actions/preloader'
import {
	requestNeedDonation
} from '../../../actions/project'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Card from '../../common/Card'
// import { history } from '../../../store'

library.add(faCheck);

//Geocode.setApiKey('AIzaSyDuMQs00SaxXjB7pQz0cwIGj-3gIVZYOGI&libraries')

class PickupDonationModal extends Component {
	state = {
		step: 0,
		error: "",
		address: "",
		pickupDays: [],
		pickups: {},
		pickupDate: null,
		pickupDateChanged: false
	}

	requestPickups = e => {
		if (this.validateForm()) {
			this.setState({error: ""})
			var data = {
				project: this.props.project._id,
				pickups: this.state.pickups,
				address: this.state.address,
				pickupDateChanged: this.state.pickupDateChanged,
				pickupDate: this.state.pickupDate
			}
			this.props.requestNeedDonation(data)
		}
	}

	changeDonationValue = need => ({ target }) => {
		let pickups = this.state.pickups;
		pickups[need._id] = target.value
		this.setState({ pickups: pickups })
	}

	validateForm = () => {
		if (this.state.address === "") {
			this.setState({ error: "Please update your address." });
			return false;
		}
		else if (this.state.pickupDay === null) {
			this.setState({ error: "Please select your pickup day." })
			return false;
		}

		return true;
	}

	componentDidMount() {
		if (this.props.user) {
			//var address = "";
			// if (this.props.user.address) {
			// 	if (typeof this.props.user.address === 'string') {
			// 		address = this.props.user.address
			// 	}
			// 	else if (typeof this.props.user.address === 'object') {
			// 		address = `${this.props.user.address.address1} ${this.props.user.address.address2}, ${this.props.user.address.city}, ${this.props.user.address.state} ${this.props.user.address.zipcode}`
			// 	}
			// 	this.setState({ address: address })
			// }
			if(this.props.user.donorAddress) {
				this.setState({address: this.props.user.donorAddress})
			}
			// else {
			// 	if( navigator.geolocation ) {
			// 		navigator.geolocation.getCurrentPosition( (position) => {
			// 			Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(response => {
			// 				this.setState({ address: response.results[0].formatted_address })
			// 			})
			// 		})
			// 	}
			// }
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.preloader.actionName === 'requestPickups' && nextProps.preloader.show === false) {
			this.setState({ step: 1 })
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
		this.setState({ step: 0, pickupDay: null, pickupDateChanged: false })
	}

	selectPickupDate = date => {
		this.setState({ pickupDate: date, pickupDateChanged: true });
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
			pickups,
			address,
			pickupDate,
			error
		} = this.state
		const {
			project
		} = this.props

		return (
			<Modal className="donationModal" showModal={this.props.showModal} closeModal={this.handleClose} width="430px" padding="40px 30px">
				{step === 0 && <div>
					<div className="text-center"><label>What items would you like to donate?</label></div>
					<div className="separator-30"></div>
					<div className="donationModal">
						{error !== '' && <div className="globalErrorHandler">{ error }</div> }
						<div className="needList">
							{project.needs.map((e, i) => {
								if (!project._needParticipations[e._id]) {
									let proc = (e.current / e.of) * 100
									return (
										<div
											key={`${i}-${e.of}`}
											className={`activiti-wrapper ${
												e.total_applicants === 0 ? 'empty' : ''
											} ${proc >= 100 ? 'full' : ''}`}>
											<div className="flex-wrapper">
												<div className="progressBar">
													<p className="needName">{e.value}</p>
													<div className="progress-wrapper">
														<div className="values">
															<span className="current">{e.current}</span><span className="of text-right">{e.of}</span>
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
													<input type="number" name="donationValue" min="0" placeholder="0" className="donationValue" onChange={this.changeDonationValue(e)} value={pickups[e._id]} />
												</div>
											</div>
										</div>
									)
								}
								return ""
							})}
						</div>
						<label className="title">Your pickup location</label>
						<p>{ address }</p>
						<div className="separator-30"></div>
						<label className="title">Select a day</label>
						<p>Nonprofits have selected their availability in which they can pick up from your location. Please select a day you'd like for {project.user.companyName} to PickUp your donation items.</p>
						<div className="separator-30"></div>
						<div className="">
							{pickupDays.map((p, i) => (
								<span key={`pickup-${i}`} className={`pickupDay ${p === pickupDate ? 'selected' : ''}`} onClick={() => this.selectPickupDate(p)}>{this.getPickupdayLabel(p)}</span>
							))}
						</div>
						<div className="separator-30"></div>
						<div className="give-button">
							<Button label={'Request Pick-up'} onClick={this.requestPickups} solid/>
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
	requestNeedDonation,
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PickupDonationModal)