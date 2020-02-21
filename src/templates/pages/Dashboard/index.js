import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import Card from '../../common/Card'
import Button from '../../common/Button'
import PieChart from '../../common/PieChart'
//import NotificationPanel from './NotificationPanel'
import VerificationModal from './VerificationModal'
import ConfirmationModal from './ConfirmationModal'
import NeedVerifyModal from './NeedVerifyModal'
import ImportContactsModal from './ImportContactsModal';
import WithdrawModal from './WithdrawModal';
import queryString from 'query-string';
import './dashboard.css';
import {
	NONE,
	PENDING,
//	CANCELLED,
	APPROVED,

//	DECLINED
} from '../../../helpers/userStatus'
import {
	PENDING as REQUEST_PENDING,
	ACCEPT as REQUEST_ACCEPT,
	REJECT as REQUEST_REJECT
} from '../../../helpers/participationTypes'
import {
	VOLUNTEER,
	PICKUP,
	DONATION
} from '../../../helpers/projectTypes'
import {
	cancelVerification,
	setVerifyStep,
	payoutStripe
} from '../../../actions/user'
import {
	getDashboardData,
	clearDashboardData,
	confirmOrRejectParticipation
} from '../../../actions/project'

import UserAvatar from '../../common/userComponents/userAvatar'
import { Hints } from 'intro.js-react'
import {
	checkHint
} from '../../../helpers/websocket'

import RecurringItem from '../profile/MyGive/RecuringItem'
import DashHeader from '../../common/DashHeader';

const OVERVIEWSTEP = 0
const BASICINFORMATION = 1
const PAYMENT = 2
const THANKYOU = 3

const PieWrapper = ({
	current,
	of,
	isPercent,
	isGradient,
	isSmall
}) => {
	let percent = 0
	let border = isSmall ? 8 : 15
	let radius = isSmall ? 30 : 45
	let data = [current, of-current]
	let colors = []
	if (isGradient)
		colors = [["#5EEDFD", "#1AAAFF"], ["transparent", "transparent"]]
	else
		colors = ["#1AAAFF", "transparent"]

	if (of === 0)
		percent = 0
	else
		percent = Number((current / of) * 100)

	return(
		<div className={`pie-chart ${isSmall ? 'small' : '' }`}>
			<span className="count percent">{isPercent && `${percent}%`}{!isPercent && `${current}/${of}`}</span>
			<PieChart
				data={ data }
				radius={ radius }
				hole={ radius - border }
				colors={ colors }
				strokeWidth={ 0 }
				isGradient={isGradient}
			/>
		</div>
	)
}

const sampleDonationProjects = [
	 {title: "School for children", "cover": "", "money": {current: 5000, total: 6900, total_applicants: 113}},
	 {title: "School for children", "cover": "", "money": {current: 5000, total: 6900, total_applicants: 113}},
]

const sampleVolunteerProjects = [
	 {title: "School for children", "cover": "", "donate_summary": {current: 113, of: 900, total_applicants: 113}},
	 {title: "School for children", "cover": "", "donate_summary": {current: 113, of: 900, total_applicants: 113}}
]

const samplePickupRequests = [
	 {user: {fullName: "Jane Doe"}, address: "PickUp address", pickupDate: 1552488668, status: 0, "cover": "", "value": 100, "need": {value: "Item"}, project: {}},
	 {user: {fullName: "Jane Doe"}, address: "PickUp address", pickupDate: 1552488668, status: 0, "cover": "", "value": 100, "need": {value: "Item"}, project: {}}
]

class Dashboard extends Component {
	state = {
		showVerificationModal: false,
		showConfirmationModal: false,
		showNeedVerifyModal: false,
		showWithdrawModal: false,
		showImportContactsModal: false,
		selectedRequest: {},
		currentStep: -1,
		connectStatus: 0,
		showReceipt: false,
		showRecurring: false,
		showHints: true,
		basicHints : [
			{
				id: 16,
				element: '.hint-withdraw',
				hint: 'The Withdraw button on general donations allows you to withdraw money donors have donated to your organization! Donors are able to give to your organization as a whole through the Give button when visiting a nonprofit profile. When logged in as a nonprofit, you can see this button on your own profile as well.',
				hintPosition: 'bottom-right'
			},
			{
				id: 17,
				element: '.hint-recurring',
				hint: 'These are the donors that regularly give to your organization! The frequency of recurring giving can range anywhere from daily to annually.',
				hintPosition: 'middle-right'
			},
			{
				id: 18,
				element: '.hint-verification',
				//hint: 'Verify your nonprofits so that you’re able to access the many features on our platform, till then creating a project and other features will be locked.',
				hint: "Verify your organization before you can start creating projects and receiving funds. Just 3 simple steps, basic information, primary contact and connect your bank account.",
				hintPosition: 'bottom-right'
			},
			{
				id: 19,
				element: '.hint-import-contact',
				hint: 'Import your donor list and we will email your donors on your organizations behalf, letting them know they are now welcome to support you through OneGivv.',
				hintPosition: 'bottom-right'
			},
			{
				id: 20,
				element: '.hint-retention',
				hint: "Retention rates show how active your donors are in terms of giving month to month and if you're losing any recurring givers.",
				hintPosition: 'middle-right'
			}
		],
		hints: [
		]
	}

	cancelVerification = e => {
		this.props.cancelVerification()
	}

	openVerificationModal = () => {
		this.setState({showVerificationModal: true}, () => {
			this.props.setVerifyStep(this.state.currentStep)
		})
	}

	closeVerificationModal = e => {
		this.setState({ showVerificationModal: false })
	}

	showAddress = (address) => {
		if (!address) return ""
		if (typeof address === 'string') return address
		if (typeof address === 'object') return `${address.address1} ${address.address2}, ${address.city}, ${address.state} ${address.zipcode}`
		return ""
	}

	closeConfirmationModal = e => {
		this.setState({ showConfirmationModal: false })
	}

	openRequestModal = request => {
		this.setState({ showConfirmationModal: true, selectedRequest: request })
	}

	acceptRequest = () => {
		this.setState({ showConfirmationModal: false }, () => {
			let need = {}
			need._id = this.state.selectedRequest._id
			need.projectId = this.state.selectedRequest.project._id
			need.status = REQUEST_ACCEPT

			this.props.confirmOrRejectParticipation(need)
		})
	}

	handleChange = (property, value) => {
		this.setState({[property]: value})
	}

	rejectRequest = (e) => {
		let need = {}
		need._id = e._id
		need.projectId = e.project._id
		need.status = REQUEST_REJECT

		this.props.confirmOrRejectParticipation(need)
	}

	addProject = (projecType) => {
		if (this.props.user.status === APPROVED || this.props.user.isApproved) {
			this.props.history.push(`/${this.props.user._id}/project/create`)
		} else {
			this.setState({ showNeedVerifyModal: true })
		}
	}

	onClickWithdraw = e => {
		e.preventDefault();
		e.stopPropagation();

		this.setState({ showWithdrawModal: true });
	}

	payoutMoney = () => {
		this.props.payoutStripe({
			cb: data => {
				window.open(data.url, '_blank')
			}
		})
	}

	closeNeedVerifyModal = e => {
		this.setState({ showNeedVerifyModal: false })
	}

	closeWithdrawModal = e => {
		this.setState({ showWithdrawModal: false })
	}

	openImportContactsModal = () => {
		// this.setState({ showImportContactsModal: true })
		this.setState({ showImportContactsModal: true })
	}

	closeImportContactsModal = e => {
		this.setState({ showImportContactsModal: false })
	}

	componentDidMount() {
		window.addEventListener('click', this.close);
		this._mounted = true
		const params = queryString.parse(this.props.location.search)
		if (params.status) {
			delete params.status
			const stringified = queryString.stringify(params)
			this.props.history.push({
				pathname: this.props.location.pathname,
				search: stringified
			})
			this.setState({showVerificationModal: true, currentStep: PAYMENT, connectStatus: parseInt(params.status)})
			return;
		}
		if (this.props.user) {
			this.props.getDashboardData();
			if(!this.props.user.aboutUs) {
				this.setState({ currentStep: OVERVIEWSTEP })
			} else if(!this.props.user.firstNameOfContact) {
				this.setState({currentStep: BASICINFORMATION})
			} else if(!this.props.user.stripeAccessToken) {
				this.setState({currentStep: PAYMENT})
			} else if(this.props.user.stripeAccessToken) {
				this.setState({currentStep: THANKYOU})
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.close)
		this._mounted = false
		this.props.clearDashboardData()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user) {
			// if(!nextProps.user.aboutUs) {
			// 	this.setState({ currentStep: OVERVIEWSTEP })
			// } else if(!nextProps.user.firstNameOfContact) {
			// 	this.setState({currentStep: BASICINFORMATION})
			// } else if(!nextProps.user.stripeAccessToken) {
			// 	this.setState({currentStep: PAYMENT})
			// } else if(nextProps.user.stripeAccessToken) {
			// 	this.setState({currentStep: THANKYOU})
			// }
			if(this.state.showVerificationModal)
				this.setState({currentStep: nextProps.currentVerifyStep})
			let hints = this.state.basicHints.filter(e => {
				if (!(nextProps.user.hints && nextProps.user.hints.includes(e.id))) {
					return e
				}
				return false
			})

			this.setState({hints})
		}
	}

	onCloseHint = idx => {
		if (!this._mounted)
			return;
		const {hints} = this.state
		const hId = hints[idx].id
		checkHint(hId)
	}

	onClickGeneralDonation = e => {
		this.setState({showReceipt : !this.state.showReceipt, showRecurring: false})
		e.stopPropagation()
	}

	onClickRecurring = e => {
		this.setState({showRecurring: !this.state.showRecurring, showReceipt: false})
		e.stopPropagation()
	}

	close = e => {
		this.setState({showReceipt: false, showRecurring: false})
	}

	render() {
		let {
			showVerificationModal,
			showConfirmationModal,
			showNeedVerifyModal,
			showImportContactsModal,
			showWithdrawModal,
			currentStep,
			connectStatus, hints, showHints,
			showReceipt, showRecurring
		} = this.state

		let {
			dashboardData,
			user
		} = this.props

		let hasVolunteerProjects = false;
		if (dashboardData && dashboardData.volunteerProjects && dashboardData.volunteerProjects.length > 0) {
			hasVolunteerProjects = true;
		}
		let hasDonationProjects = false;
		if (dashboardData && dashboardData.donationProjects && dashboardData.donationProjects.length > 0) {
			hasDonationProjects = true;
		}
		let hasPickupRequests = false;
		if (dashboardData && dashboardData.pickupRequests && dashboardData.pickupRequests.length > 0) {
			hasPickupRequests = true;
		}

		let volunteerProjects = hasVolunteerProjects ? dashboardData.volunteerProjects : sampleVolunteerProjects;
		let donationProjects = hasDonationProjects ? dashboardData.donationProjects : sampleDonationProjects;
		let pickupRequests = hasPickupRequests ? dashboardData.pickupRequests : samplePickupRequests;

		return (
			<div>
				{user && <div className={`DashboardPage main-font ${user.isApproved ? '' : 'unapproved'}`}>
					<Hints 
						enabled={showHints}
						hints={hints}
						onClose={this.onCloseHint}
						ref={hints => this.hintRef = hints}
					/>
					<div className="VerificationModal"><VerificationModal showModal={showVerificationModal} closeModal={this.closeVerificationModal} currentStep={currentStep} handleChange={this.handleChange} connectStatus={connectStatus}/></div>
					<div className="ConfirmationModal"><ConfirmationModal showModal={showConfirmationModal} closeModal={this.closeConfirmationModal} acceptRequest={this.acceptRequest} /></div>
					<ImportContactsModal showModal={showImportContactsModal} closeModal={this.closeImportContactsModal} acceptRequest={this.acceptRequest} />
					{ !(user.status === APPROVED || user.isApproved) && <NeedVerifyModal showModal={showNeedVerifyModal} closeModal={this.closeNeedVerifyModal} /> }
					{ (user.isApproved) && <div className='WithdrawModal'><WithdrawModal showModal={showWithdrawModal} closeModal={this.closeWithdrawModal} totalDonation={dashboardData.totalDonation} /></div> }
					<div className="row">
						<div className="leftBlock col-12">
							<DashHeader type={0}></DashHeader>
							<div className="row">
								<div className="col-4">
									<Card className="verificationPanel" padding="10px">
										<div className="panel-body fixed-width">
											{(user.status === APPROVED || user.isApproved)
												? <div className="text-center">
													<div className="orange">General Donations</div>
													<div className="separator-20" />
													<img src="/images/ui-icon/icon-money.svg" alt="Money Icon" onClick={this.onClickGeneralDonation}/>
													<div className="count">${dashboardData.totalDonation}</div>
													<div className="center">
														<div style={{margin: "0 3px"}}>
															<Button className="hint-withdraw" inverse label="Withdraw" padding="6px 32px" onClick={this.onClickWithdraw}
															/>
														</div>
														<div style={{margin: "0 3px"}}>
															<Button className="hint-withdraw" inverse label="Payout" padding="6px 32px" onClick={() => this.payoutMoney()}
															/>
														</div>
													</div>
													{showReceipt && <Card className="receipt-list" padding="10px">
														<div className="title">Receipt List</div>
														<div className="content-body">
															{dashboardData && dashboardData.receiptList && dashboardData.receiptList.length !== 0 && dashboardData.receiptList.map((e, i) => {
																return(
																	<Fragment key={e._id}>
																		<RecurringItem user={e.user} donation={e.donation}/>
																	</Fragment>
																)
															})}
														</div>
													</Card>}
												</div>:
												<div>
													<div className="verification-process">
														{user.status === NONE && currentStep === OVERVIEWSTEP && 
															<PieWrapper isPercent={true} of={100} current={0} isSmall={false} />}
														
														{user.status === NONE && currentStep === BASICINFORMATION && 
															<PieWrapper isPercent={true} of={100} current={30} isSmall={false} />}
														
														{user.status === NONE && currentStep === PAYMENT && 
															<PieWrapper isPercent={true} of={100} current={60} isSmall={false} />}
														{user.status === PENDING && currentStep === THANKYOU &&
															<PieWrapper isPercent={true} of={100} current={100} isSmall={false} />
														}
														{/* {(user.status === NONE || user.status === CANCELLED || user.status === DECLINED) &&
															<PieWrapper isPercent={true} of={100} current={0} isSmall={false} />
														} */}
														<ul>
															<li className={`${currentStep > OVERVIEWSTEP ? 'active' : ''}`}>Mission Statement</li>
															<li className={`${currentStep > BASICINFORMATION ? 'active' : ''}`}>Basic Information</li>
															<li className={`${currentStep > PAYMENT ? 'active' : ''}`}>Connect bank account</li>
														</ul>
													</div>
													<div className="center">
														{(() => {
															if (currentStep === THANKYOU) {
																return (
																	<div>
																		{user && <Button inverse label="Pending" />}
																	</div>
																)
															} else {
																return (
																	<div>
																		{user && user.status === NONE && <Button className="hint-verification" solid label="Get Verified" onClick={this.openVerificationModal} padding="6px 32px" />}
																		{user && user.status === PENDING && <Button inverse label="Verification Sent" padding="6px 32px" />}
																		{/* {user && user.status === PENDING && <Button inverse label="Cancel" onClick={this.cancelVerification} padding="6px 32px" />}
																		{user && user.status === CANCELLED && <Button inverse label="Submit Document" onClick={this.openVerificationModal} padding="6px 32px" />}
																		{user && user.status === DECLINED && <Button inverse label="Submit Document" onClick={this.openVerificationModal} padding="6px 32px" />} */}
																	</div>
																)
															}
														})()}
													</div>
												</div>
											}
										</div>
									</Card>
									<div className="separator-30" />
								</div>
								<div className="col-4">
									<Card className="contractPanel" padding="10px">
										<div className="panel-body text-center fixed-width">
											{ (user.status === APPROVED || user.isApproved)
												? <div className="row">
													<div className="col-12">
														<div className="panel-header text-center">
															<label className="orange">Supporters</label>
														</div>
													</div>
													<div className="col-6 ">
														<img src="/images/ui-icon/icon-user.svg" alt="Contact Icon" />
														<p className="p">Donor List</p>
														<div className="count">{dashboardData.contacts ? dashboardData.contacts : 0}</div>
													</div>
													<div className="col-6" onClick={this.onClickRecurring}>
														<img className="hint-recurring" src="/images/ui-icon/icon-rocket.svg" alt="Rocket Icon" />
														<p className="p">Recurring Donors</p>
														<div className="count">0</div>
													</div>
													{showRecurring && <Card className="receipt-list" padding="10px">
														<div className="title">Recurring List</div>
														<div className="content-body">
															{dashboardData && dashboardData.recurringList && dashboardData.recurringList.length !== 0 && dashboardData.recurringList.map((e, i) => {
																return(
																	<Fragment key={e._id}>
																		<RecurringItem user={e.user} donation={e.donation}/>
																	</Fragment>
																)
															})}
														</div>
													</Card>}
												</div>
												:<div>
													<div className="row">
														<div className="col-6 ">
															<div className="count" style={{ lineHeight: '36px' }}>0</div>
															<p className="p">My Contacts</p>
															<img src="/images/ui-icon/icon-user-grey.svg" alt="Contact Icon" width="26" />
														</div>
														<div className="col-6">
															<div className="count" style={{ lineHeight: '36px' }}>0</div>
															<p className="p">Recurring Donors</p>
															<img src="/images/ui-icon/icon-rocket-grey.svg" alt="Rocket Icon" width="26" />
														</div>
													</div>
													<div className="separator-30" />
													<div className="center">
														<Button className="hint-import-contact" inverse label="Import Contacts" padding="6px 32px"
															onClick={() => this.openImportContactsModal()}
														/>
													</div>
												</div>
											}
										</div>
									</Card>
									<div className="separator-30" />
								</div>
								<div className="col-4">
									<Card className="retentionPanel" padding="10px">
										<div className="panel-header text-center hint-retention">
											<label className="orange">Donation Retention</label>
										</div>
										<div className="panel-body text-center fixed-width">
											<div className="row">
												<div className="col-6">
													<PieWrapper isPercent={true} of={100} current={0} isSmall={false} />
													<div className="separator-15" />
													<ul>
														<li>this week</li>
													</ul>
												</div>
												<div className="col-6">
													<PieWrapper isPercent={true} of={100} current={0} isSmall={false} />
													<div className="separator-15" />
													<ul>
														<li>this month</li>
													</ul>
												</div>
											</div>
										</div>
									</Card>
									<div className="separator-30" />
								</div>
								<div className="col-4">
									<Card className="requestsPanel" padding="10px">
										<div className="panel-header text-center">
											<label className="label orange">Donation projects</label>
										</div>
										<div className="panel-body">
											{!hasDonationProjects &&
												<div className="text-center">
													<p>Add your first donation project to start receiving donations!</p>
													<div className="separator-30" />
													<div className="center">
														<Button solid inverse label="Add Project" padding="6px 32px" onClick={() => this.addProject(DONATION)} />
													</div>
												</div>
											}
											<div className="separator-20" />
											<div className={`projects ${hasDonationProjects ? '' : 'sample'}`}>
											{donationProjects.map((e, i) => {
												let proc = e.money ? (e.money.current / e.money.total) * 100 : 0
												return (
													<div key={i} className="projectWrapper">
														<NavLink to={`/${user._id}/project/${e._id}`} className="coverImg">
															{e.cover && <img src={e.cover} alt="Project Cover Img" />}
														</NavLink>
														<div className="progressBar">
															<div className="progress-wrapper">
																<div className="projectTitle">
																	<NavLink to={`/${user._id}/project/${e._id}`}>
																		<p>{e.title}</p>
																	</NavLink>
																</div>
																<div className="projectDetail">
																	<div className="donors">
																		<div>{e.money ? e.money.total_applicants : 0}</div>
																		<span className="small">Donors</span>
																	</div>
																	<div className="money">
																		<div>${e.money ? e.money.current : 0}/${e.money ? e.money.total : 0}</div>
																		<span className="small">Goal</span>
																	</div>
																</div>
																<div className="progress">
																	<div className="progress-contain" style={{
																		width: `${
																			proc > 100
																				? 100
																				: proc
																		}%`
																	}} />
																</div>
															</div>
														</div>
													</div>
													)
												}
											)}
											</div>
										</div>
									</Card>
									<div className="separator-30" />
								</div>
								<div className="col-4">
									<Card className="requestsPanel" padding="10px">
										<div className="panel-header text-center">
											<label className="label orange">Volunteer projects</label>
										</div>
										<div className="panel-body">
											{!hasVolunteerProjects &&
												<div className="text-center">
													<p>Add your first volunteer project to engage supporters!</p>
													<div className="separator-30" />
													<div className="center">
														<Button solid inverse label="Add Project" padding="6px 32px" onClick={() => this.addProject(VOLUNTEER)} />
													</div>
												</div>
											}
											<div className="separator-20" />
											<div className={`projects ${hasVolunteerProjects ? '' : 'sample'}`}>
											{volunteerProjects.map((e, i) => {
												let proc = e.donate_summary ? (e.donate_summary.current_vol / e.donate_summary.total) * 100 : 0
												return (
													<div key={i} className="projectWrapper">
														<NavLink to={`/${user._id}/project/${e._id}`} className="coverImg">
															{e.cover && <img src={e.cover} alt="Project Cover Img" />}
														</NavLink>
														<div className="progressBar">
															<div className="progress-wrapper">
																<div className="projectTitle">
																	<NavLink to={`/${user._id}/project/${e._id}`}>
																		<p>{e.title}</p>
																	</NavLink>
																</div>
																<div className="projectDetail">
																	<div className="donors">
																		<div>{e.donate_summary ? e.donate_summary.total_applicants : 0}</div>
																		<span className="small">Volunteers</span>
																	</div>
																	<div className="money">
																		<div>{e.donate_summary ? e.donate_summary.total : 0}</div>
																		<span className="small">Goal</span>
																	</div>
																</div>
																<div className="progress">
																	<div className="progress-contain" style={{
																		width: `${
																			proc > 100
																				? 100
																				: proc
																		}%`
																	}} />
																</div>
															</div>
														</div>
													</div>
													)
												}
											)}
											</div>
										</div>
									</Card>
									<div className="separator-30" />
								</div>
								<div className="col-4">
									<Card className="requestsPanel" padding="10px">
										<div className="panel-header text-center">
											<label className="label orange">PickUp request</label>
										</div>
										<div className="panel-body">
											{!hasPickupRequests &&
												<div className="text-center">
													<p>Set up PickUp location and receive PickUp requests from your donors and supporters! </p>
													<div className="separator-30" />
													<div className="center">
														<Button solid inverse label="Set Up" padding="6px 32px" onClick={() => this.addProject(PICKUP)} />
													</div>
												</div>
											}
											<div className="separator-20" />
											<div className={`requests ${hasPickupRequests ? '' : 'sample'}`}>
											{pickupRequests.map((e, i) => {
												return (
													<div key={i} className="request">
														<NavLink to={`/${user._id}/project/${e.project._id}`} className="user">
															<UserAvatar
																imgUser={e.user.avatar}
																imgUserType={e.user.role}
																userId={e.user._id}
																size={46}
															/>
														</NavLink>
														<div className="requestDetail">
															<div className="userName">{e.user.fullName}</div>
															<div className="address small">{e.address}</div>
															<div className="pickupdate small">{moment.unix(e.pickupDate).format('LLL')}</div>
															<ul className="needs">
																<li>{e.need.value} {e.value}</li>
															</ul>
														</div>
														{ e.status === REQUEST_PENDING && <div className="button-group">
															<Button solid className="accept-button" label="Accept" onClick={() => this.openRequestModal(e)} padding="6px 18px" disabled={!hasPickupRequests} />
															<Button solid inverse className="reject-button" label="Decline" onClick={() => this.rejectRequest(e)} padding="6px 18px" disabled={!hasPickupRequests} />
														</div> }
														{ e.status === REQUEST_ACCEPT && <span className="accept">Accepted</span> }
														{ e.status === REQUEST_REJECT && <span className="reject">Rejected</span> }
													</div>
												)
											})}
											</div>
										</div>
									</Card>
									<div className="separator-30" />
								</div>
							</div>
						</div>
						{/* <div className="notificationBlock col-12">
							<Card>
								<NotificationPanel />
							</Card>
						</div> */}
					</div>
				</div>}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	dashboardData: state.project.dashboardData,
	currentVerifyStep: state.user.currentVerifyStep
})

const mapDispatchToProps = {
	cancelVerification,
	getDashboardData,
	clearDashboardData,
	confirmOrRejectParticipation,
	setVerifyStep,
	payoutStripe
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard)