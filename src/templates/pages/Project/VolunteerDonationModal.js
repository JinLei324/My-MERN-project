import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Card from '../../common/Card'
import {
	togglePreloader
} from '../../../actions/preloader'
import {
	setVolunteerActivity
} from '../../../actions/project'
// import { history } from '../../../store'

library.add(faCheck);

class VolunteerDonationModal extends Component {
	state = {
		step: 0,
		error: 0,
		startTime: null,
		endTime: null
	}

	componentWillReceiveProps(nextprops) {
		if (nextprops.preloader.actionName === 'setVolunteer' && nextprops.preloader.show === false) {
			this.setState({ step: 1 })
		}

		if (nextprops.project) {
			this.setState({ startTime: moment.unix(nextprops.project.startDate), endTime: moment.unix(nextprops.project.endDate) })
		}
	}

	handleClose = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ step: 0 })
			this.props.handleClose()
		}
	}

	unixToDate = u => {
		return moment.unix(u)
	}

	unixDateToString = d => {
		const date = moment.unix(d)
		return date.format('hh:mm a')
	}

	fullTime = d => {
		return moment(d).format('dddd, MMMM Do, YYYY') + ' at ' + moment(d).format('hh:mm a')
	}

	handling = key => e => {
		this.setState({ [key]: e })
	}

	sendRequest = () => {
		let data = {
			project: this.props.project._id,
			need: this.props.need._id,
			startDate: this.state.startTime.format('X'),
			endDate: this.state.endTime.format('X'),
			isReapply: this.props.isReapply
		}

		this.props.setVolunteerActivity(data)
	}

	viewRequest = () => {
		// history.push(`/${this.props.user._id}/projects`);
		this.done();
	}

	done = () => {
		this.setState({ step: 0 })
		this.props.togglePreloader({ show: true, actionName: '' })
		this.props.handleClose()
	}

	render() {

		const {
			step,
			startTime,
			endTime
		} = this.state

		const {
			project,
			need
		} = this.props
		
		return(
			<Modal className="donationModal" showModal={this.props.showModal} closeModal={this.handleClose} width="430px" padding="60px 0 30px">
				<div className="volunteerDonationModal">
					{step === 0 && <div>
						<label>How many hours are you able to Volunteer to {project.title}</label>
						<div className="separator-20"></div>
						<p>This event is from<br />{this.unixDateToString(project.startDate)} to {this.unixDateToString(project.endDate)}</p>
						<div className="separator-20"></div>
						<p className="title">Time: </p>
						<div className="activities">
							<div className="field">
								<DatePicker
									className="control"
									selected={startTime}
									key={startTime}
									onChange={this.handling('startTime')}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="LT"
									minTime={this.unixToDate(project.startDate)}
									maxTime={endTime}
									disabledKeyboardNavigation
								/>
							</div>
							<span>to</span>
							<div className="field">
								<DatePicker
									className="control"
									selected={endTime}
									key={endTime}
									onChange={this.handling('endTime')}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={15}
									dateFormat="LT"
									minTime={startTime}
									maxTime={this.unixToDate(project.endDate)}
									disabledKeyboardNavigation
								/>
							</div>
						</div>
						<div className="separator-30"></div>
						<div className="text-center">
							<Button solid label="Volunteer" padding="8px 32px" onClick={() => this.sendRequest()} />
						</div>
					</div>}
					{step === 1 && <div>
						<div className="text-center">
							<div className="success-box">
								<FontAwesomeIcon icon="check" className="_icon" />
							</div>
							<div className="separator-20"></div>
							<p style={{fontWeight: 500}}>All done! You've applied to be a ({need.value}) for ({project.title}) on {this.fullTime(startTime)} </p>
							<div className="separator-20"></div>
							<p className=""><small>They will be in touch with you shortly!</small></p>
							<Card className="type-wrapper" padding="0">
								<button onClick={() => this.viewRequest()} className={`wrapper animation-click-effect`}><span>View My Request</span></button>
								<button onClick={() => this.done()} className={`wrapper animation-click-effect active`}><span>Done</span></button>
							</Card>
						</div>
					</div>}
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	preloader: state.preloader
})

const mapDispatchToProps = {
	setVolunteerActivity,
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VolunteerDonationModal)