import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment';

import NumberFormat from 'react-number-format';

import { history } from '../../../store'
import {
	getParticipationList,
	confirmOrRejectParticipation
} from '../../../actions/project'

import PeopleList from './peopleList'
import Button from '../../common/Button'
import { signUp } from '../../common/authModals/modalTypes'
import { PENDING, ACCEPT, REJECT, CANCEL } from '../../../helpers/participationTypes'
import { NONPROFIT } from '../../../helpers/userRoles';
import { VOLUNTEER, PICKUP, DONATION } from '../../../helpers/projectTypes'
import PickupDonationModal from './PickupDonationModal'
import PickupUpdateModal from './PickupUpdateModal'
import VolunteerDonationModal from './VolunteerDonationModal'
import VolunteerUpdateModal from './VolunteerUpdateModal'
import UserAvatar from '../../common/userComponents/userAvatar'

class Needs extends Component {
	state = {
		activeTab: {},
		skipUsers: 0,
		showPickupDonationModal: false,
		showPickupUpdateModal: false,
		isReapply: false,
		showVolunteerDonationModal: false,
		showVolunteerUpdateModal: false,
		selectedNeed: null,
		selectedRequest: null
	}

	disableButtonLoad = () => {
		return (
			this.state.skipUsers > this.props.currentNeedPeoples.length ||
			this.props.currentNeedPeoples.length % 10 !== 0
		)
	}

	checkDeadLine = () => {
		/* UTC!!!! */
		let now = moment.utc(),
			start = moment(this.props.project.startDate * 1000),
			// end = moment(this.props.project.endDate * 1000),
			deadline = now.isAfter(start);

		return deadline;
	}

	checkDeadLinePlus = () => {
		/* UTC!!!! */
		let now = moment.utc(),
			start = moment(this.props.project.startDate * 1000)
				.subtract(1, 'h')
				.utc(),
			deadline = now.isAfter(start);

		return deadline;
	}

	acceptRequest = need => {
		let _need = need;
		_need.projectId = this.props.project._id;
		_need.status = ACCEPT;

		this.props.confirmOrRejectParticipation(_need);
	}

	rejectRequest = need => {
		let _need = need;
		_need.projectId = this.props.project._id;
		_need.status = REJECT;

		this.props.confirmOrRejectParticipation(_need);
	}

	cancelRequest = need => {
		let _need = need;
		_need.projectId = this.props.project._id;
		_need.status = CANCEL;

		this.props.confirmOrRejectParticipation(_need);
	}

	changeRequest = (request, need) => {
		if (this.props.project.projectType === (VOLUNTEER)) {
			this.setState({ showVolunteerUpdateModal: true, selectedRequest: JSON.parse(JSON.stringify(request)), selectedNeed: need })
		} else if (this.props.project.projectType === (PICKUP)) {
			this.setState({ showPickupUpdateModal: true, selectedRequest: JSON.parse(JSON.stringify(request)), selectedNeed: need })
		}
	}

	toggleActiveTab = activeNeed => {
		if (this.props.isMy && activeNeed.total_applicants !== 0) {
			this.setState({ skipUsers: 0 })
			this.state.activeTab === activeNeed
				? this.setState({ activeTab: {} })
				: this.setState({ activeTab: activeNeed }, this.showUsers)
		}
	}

	loadMoreUsers = () => {
		this.setState({ skipUsers: this.state.skipUsers + 10 }, () => {
			this.props.getParticipationList(
				this.state.activeTab,
				this.state.skipUsers
			)
		})
	}

	showUsers = () => {
		if (this.props.isMy) {
			this.props.getParticipationList(
				this.state.activeTab,
				this.state.skipUsers
			)
		}
	}

	onGive = e => {
		if (e)
			e.preventDefault();

		const { isAuth, user } = this.props;

		if (!isAuth || !user) {
			history.push(
				`?modal=${signUp}`
			);
		} else {
			this.setState({ showPickupDonationModal: true });
		}
	}

	closePickupDonationModal = () => {
		this.setState({ showPickupDonationModal: false });
	}

	onVolunteer = e => {
		const { isAuth, user, project } = this.props;

		if (!isAuth || !user) {
			history.push(
				`?modal=${signUp}`
			);
		} else {
			let isReapply = false;
			isReapply = (project._needParticipations[e._id] && project._needParticipations[e._id].status === CANCEL);
			this.setState({ showVolunteerDonationModal: true, isReapply: isReapply, selectedNeed: e });
		}
	}
	
	closeVolunteerDonationModal = () => {
		this.setState({ showVolunteerDonationModal: false });
	}

	closeVolunteerUpdateModal = () => {
		this.setState({ showVolunteerUpdateModal: false, selectedNeed: null, selectedRequest: null });
	}

	closePickupUpdateModal = () => {
		this.setState({ showPickupUpdateModal: false, selectedNeed: null, selectedRequest: null });
	}

	getDate = (d) => {
		if (!d) return "";
		return moment.unix(d).format('dddd, MMMM D, YYYY');
	}

	getTime = (d) => {
		if (!d) return "";
		return moment.unix(d).format('hh:mm a');
	}

	getNeedName = (need_id) => {
		let need = this.props.project.needs.find((e) => {
			return e._id === need_id;
		})
		return need.value;
	}

	render() {
		const {
			isMy,
			user,
			project,
			currentNeedPeoples,
			isEnd,
			isCancel
		} = this.props;

		const {
			activeTab,
			showPickupDonationModal,
			showPickupUpdateModal,
			isReapply,
			showVolunteerDonationModal,
			showVolunteerUpdateModal,
			selectedNeed,
			selectedRequest
		} = this.state;

		return (
			<div className="projectNeeds">
				{ project && project.projectType === (PICKUP) && 
					<div>
						<PickupDonationModal project={project} showModal={showPickupDonationModal} handleClose={this.closePickupDonationModal} />
						<PickupUpdateModal request={selectedRequest} need={selectedNeed} project={project} showModal={showPickupUpdateModal} handleClose={this.closePickupUpdateModal} />
					</div>
				}
				{ project && project.projectType === (VOLUNTEER) &&
					<div>
						<VolunteerDonationModal need={selectedNeed} project={project} showModal={showVolunteerDonationModal} isReapply={isReapply} handleClose={this.closeVolunteerDonationModal} />
						<VolunteerUpdateModal request={selectedRequest} need={selectedNeed} project={project} showModal={showVolunteerUpdateModal} handleClose={this.closeVolunteerUpdateModal} />
					</div>
				}
				<p className="title main-font text-center">
					{project.projectType === VOLUNTEER && 'Volunteer'}
					{project.projectType === PICKUP && 'PickUp'} Items
				</p>
				{ project.needs.map((e, i) => { 
					let proc = (e.current / e.of) * 100;
					
					let applyDisabled = false;
					if (isEnd || isCancel) applyDisabled = true;
					if (project._needParticipations[e._id] && project._needParticipations[e._id].status === PENDING) applyDisabled = true;
					if (project._needParticipations[e._id] && project._needParticipations[e._id].status === CANCEL) applyDisabled = false;
					
					return (
						<div
							key={`${i}-${e.of}`}
							className={`activiti-wrapper ${
								activeTab._id === e._id
									? 'active'
									: ''
							} ${isMy ? 'myTabs' : ''} ${
								e.total_applicants === 0 ? 'empty' : ''
							} ${proc >= 100 ? 'full' : ''}`}>
							{/* <div
								onClick={() =>
									this.toggleActiveTab(e)
								}
								className={`${
									!isMy ? '' : 'clickedPart'
								}`}> */}
							<div
								onClick={() =>
									this.toggleActiveTab(e)
								}
								className='clickedPart'>
								<div className="flex-wrapper">
									<div className="progressBar">
										<p className="needName">{e.value}</p>
										<div className="progress-wrapper">
											<div className="values">
												<span className="current">
													{ (project.projectType === DONATION) ? 
														<NumberFormat value={e.current} displayType={'text'} thousandSeparator={true} prefix={'$'} /> : 
														<NumberFormat value={e.current} displayType={'text'} thousandSeparator={true} prefix={''} /> 
													}
												</span>
												<span className="of text-right">
													{ (project.projectType === DONATION) ? 
														<NumberFormat value={e.of} displayType={'text'} thousandSeparator={true} prefix={'$'} /> : 
														<NumberFormat value={e.of} displayType={'text'} thousandSeparator={true} prefix={''} /> 
													}
												</span>
											</div>
											<div
												className={`progress ${isMy &&
													'full'}`}>
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
								</div>
								{ ( !user || ( !isMy && user && user.role !== NONPROFIT && project.projectType === VOLUNTEER)) && (
									<div className="give-button">
										<Button
											label={ ( project._needParticipations[e._id] && project._needParticipations[e._id].status === CANCEL ) ? 'Reapply' : 'Apply' }
											onClick={ () => this.onVolunteer(e) }
											disabled={ applyDisabled }
											solid
										/>
									</div>
								)}
								{isMy && e.total_applicants > 0 && (
									<div className="arrowBlock">
										<span className="arrow" />
									</div>
								)}
							</div>
							{ project.projectType === (PICKUP) && project._needParticipations && project._needParticipations[e._id] &&
								<div className="yourRequest">
									<div className="request-info">
										<UserAvatar
											imgUser={user.avatar}
											imgUserType={user.role}
											userId={user._id}
										/>
										<div className="project-info">
											<div className="project-title">{project.title}</div>
											<div className="address">{project._needParticipations[e._id].address}</div>
										</div>
										<div className="activity-info">
											<div className="activity"><label>Donation Item:</label></div>
											<ul className="items">
												<li>{ project._needParticipations[e._id].value } { e.value }</li>
											</ul>
											<div className="activity-date">{ this.getDate(project._needParticipations[e._id].pickupDate) }</div>
										</div>
									</div>
									<div className="request-result">
										{ project._needParticipations[e._id].status === PENDING && <div className="action-buttons">
											<Button padding="5px 8px" solid label="Change" onClick={() => this.changeRequest(project._needParticipations[e._id], e)} />
											<Button padding="5px 8px" solid inverse label="Cancel" onClick={() => this.cancelRequest(project._needParticipations[e._id])} />
										</div>}
										{ project._needParticipations[e._id].status === ACCEPT && <div className="action-buttons">
											<span className="accept">Accepted</span>
											<Button padding="5px 8px" solid inverse label="Cancel" onClick={() => this.cancelRequest(project._needParticipations[e._id])} />
										</div>}
										{ project._needParticipations[e._id].status === REJECT && <div className="action-buttons">
											<span className="reject">Declined</span>
										</div>}
										{ project._needParticipations[e._id].status === CANCEL && <div className="action-buttons">
											<span className="cancel">Cancelled</span>
										</div>}
									</div>
								</div>
							}
							{ project.projectType === (VOLUNTEER) && project._needParticipations && project._needParticipations[e._id] &&
								<div className="yourRequest">
									<div className="request-info">
										<UserAvatar
											imgUser={user.avatar}
											imgUserType={user.role}
											userId={user._id}
										/>
										<div className="project-info">
											<div className="project-title">{project.title}</div>
											<div className="address">{project.address}</div>
										</div>
										<div className="activity-info">
											<div className="activity">
												<label>Volunteer Activities:</label> { e.value }</div>
											<div className="activity-date">{ this.getDate(project.startDate) }</div>
											<div className="activity-time">
												{ this.getTime(project._needParticipations[e._id].startDate) } - { this.getTime(project._needParticipations[e._id].endDate) }
											</div>
										</div>
									</div>
									<div className="request-result">
										{ project._needParticipations[e._id].status === PENDING && <div className="action-buttons">
											<Button padding="5px 8px" solid label="Change" onClick={() => this.changeRequest(project._needParticipations[e._id], e)} />
											<Button padding="5px 8px" solid inverse label="Cancel" onClick={() => this.cancelRequest(project._needParticipations[e._id])} />
										</div>}
										{ project._needParticipations[e._id].status === ACCEPT && <div className="action-buttons">
											<span className="accept">Accepted</span>
											<Button padding="5px 8px" solid inverse label="Cancel" onClick={() => this.cancelRequest(project._needParticipations[e._id])} />
										</div>}
										{ project._needParticipations[e._id].status === REJECT && <div className="action-buttons">
											<span className="reject">Declined</span>
										</div>}
										{ project._needParticipations[e._id].status === CANCEL && <div className="action-buttons">
											<span className="cancel">Cancelled</span>
										</div>}
									</div>
								</div>
							}
							<div className="ulWrapperForPeople">
								{isMy && currentNeedPeoples.length !== 0 && activeTab._id === e._id && (
									<PeopleList
										disableButtonLoad={
											this
												.disableButtonLoad
										}
										currentNeedPeoples={
											this.props
												.currentNeedPeoples
										}
										acceptRequest={
											this.acceptRequest
										}
										rejectRequest={
											this.rejectRequest
										}
										loadMoreUsers={
											this.loadMoreUsers
										}
										activeButtons={isEnd || isCancel}
									/>
								)}
							</div>
						</div>
					)
				})}
				<div className="separator-20"></div>
				{(!isMy && project.projectType === PICKUP) && (
					<div className="give-button">
						<Button
							label="Request PickUp"
							onClick={this.onGive}
							disabled={isEnd || isCancel}
							solid
						/>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = ({ authentication, project }) => ({
	user: authentication.user,
	userId: authentication.userId,
	currentNeedPeoples: project.currentNeedPeoples,
	isAuth: authentication.isAuth
})

const mapDispatchToProps = {
	getParticipationList,
	confirmOrRejectParticipation
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Needs)