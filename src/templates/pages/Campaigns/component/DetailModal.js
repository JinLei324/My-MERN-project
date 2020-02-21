import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Modal from '../../../common/Modal'
import {
	getRequestsByProject,
	clearProjectRequests,
	confirmOrRejectParticipation
} from '../../../../actions/project'
import {
	VOLUNTEER,
	DONATION,
	PICKUP
} from '../../../../helpers/projectTypes'
import {
	PENDING,
	ACCEPT,
	REJECT
} from '../../../../helpers/participationTypes'
import RequestsTable from './RequestsTable'

class DetailModal extends Component {

	state = {
		currentTab: "",
		showModal: false,
		page: 0,
		limit: 10,
		search: "",
		isfirst: true
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.showDetailModal && nextProps.project.projectId && this.state.isfirst) {
			this.setState({page: 0, isfirst: false}, () => {
				this.setDefaultTab(nextProps.activeType)
				this.setState({ showModal: true })
			})
		}
	}

	setDefaultTab = (type) => {
		switch (type) {
			case VOLUNTEER:
				this.onVolunteerTab('all')
				break;
			case DONATION:
				this.onDonationTab('all')
				break;
			case PICKUP:
				this.onPickupTab('new')
				break;
			default:
				break;
		}
	}

	onVolunteerTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	onDonationTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	onPickupTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	loadRequests = () => {
		let query = {
			projectId: this.props.project.projectId,
			skip: this.state.page * this.state.limit,
			limit: this.state.limit,
			search: this.state.search
		}

		switch (this.props.activeType) {
			case VOLUNTEER:
				if (this.state.currentTab === 'new') {
					query = {
						...query,
						status: [PENDING]
					}
				}
				else if (this.state.currentTab === 'recurring') {
					query = {
						...query,
						status: [ACCEPT, REJECT]
					}
				}
				break;
			case DONATION:
				if (this.state.currentTab === 'recurring') {}
				else if (this.state.currentTab === 'non-cash') {}
				break;
			case PICKUP:
				if (this.state.currentTab === 'new') {
					query = {
						...query,
						status: [PENDING]
					}
				}
				else if (this.state.currentTab === 'upcoming') {
					query = {
						...query,
						status: [ACCEPT,REJECT]
					}
				}
				break;
			default:
				break;
		}

		this.props.getRequestsByProject(query)
	}

	filterByUsername = e => {
		this.setState({ page: 0, search: e.target.value }, () => {
			this.loadRequests()
		})
	}

	gotoPage = page => {
		this.setState({ page: page }, () => {
			this.loadRequests()
		})
	}

	acceptRequest = e => {
		let need = {}
		need._id = e._id
		need.projectId = e.project._id
		need.status = ACCEPT

		this.props.confirmOrRejectParticipation(need)
	}

	rejectRequest = e => {
		let need = {}
		need._id = e._id
		need.projectId = e.project._id
		need.status = REJECT

		this.props.confirmOrRejectParticipation(need)
	}

	closeModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showModal: false, isfirst: true })
			this.props.closeDetailModal()
			this.props.clearProjectRequests()
		}
	}

	render() {
		const {
			showModal,
			currentTab,
			limit,
			page
		} = this.state

		const {
			activeType,
			requests,
			project
		} = this.props

		return (
			<div className="CampaignsDetailModal">
				<Modal title={project.title} showModal={showModal} closeModal={this.closeModal} width="900px">
					{ activeType === VOLUNTEER && 
						<div className="RequestsHeader">
							<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onVolunteerTab('all')
							}}>All Volunteers</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'new' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onVolunteerTab('new')
							}}>New Volunteer Applications</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'recurring' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onVolunteerTab('recurring')
							}}>Recurring Volunteers</NavLink>
						</div>
					}
					{ activeType === DONATION && 
						<div className="RequestsHeader">
							<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onDonationTab('all')
							}}>All Money Donations</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'recurring' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onDonationTab('recurring')
							}}>Recurring Gifts</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'non-cash' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onDonationTab('non-cash')
							}}>Non-Cash Gifts</NavLink>
						</div>
					}
					{ activeType === PICKUP && 
						<div className="RequestsHeader">
							<NavLink to="#" className={`main-font tab ${currentTab === 'new' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onPickupTab('new')
							}}>New PickUp Request</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'upcoming' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onPickupTab('upcoming')
							}}>Upcoming PickUps</NavLink>
							<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
								e.stopPropagation()
								this.onPickupTab('all')
							}}>All PickUps</NavLink>
						</div>
					}
					<div className="separator-25" />
					<div className="RequestsBody">
						<RequestsTable activeType={activeType} requests={requests} page={page} gotoPage={this.gotoPage} limit={limit} filterByUsername={this.filterByUsername} acceptRequest={this.acceptRequest} rejectRequest={this.rejectRequest} />
					</div>
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	requests: state.project.projectRequests
})

const mapDispatchToProps = {
	getRequestsByProject,
	clearProjectRequests,
	confirmOrRejectParticipation
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DetailModal)