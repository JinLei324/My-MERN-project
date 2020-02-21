import React, { Component } from 'react'
import Moment from 'moment';
import { connect } from 'react-redux'
import {
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
import Button from '../../../common/Button'
import UserAvatar from '../../../common/userComponents/userAvatar'
import Modal from '../../../common/Modal'
import ReactPaginate from 'react-paginate';

class RequestsTable extends Component {

	state = {
		showConfirmModal: false,
		selectedNeed: null,
		pages: 1,
		page: 1
	}

	componentWillReceiveProps(nextProps) {
		const {
			requests,
			limit,
			page
		} = nextProps

		if (requests.total && requests.total > limit) {
			const pages = Math.ceil(requests.total / limit)
			this.setState({ pages, page })
		}
		else {
			this.setState({ pages: 1, page: 1 })
		}
	}

	closeConfirmModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showConfirmModal: false })
		}
	}

	openConfirmModal = need => {
		this.setState({ showConfirmModal: true, selectedNeed: need })
	}

	acceptRequest = e => {
		this.setState({ showConfirmModal: false }, () => {
			this.props.acceptRequest(this.state.selectedNeed)
		})
	}

	getDuration = (start, end, e) => {
		return (
			<div>{Moment.unix(start).format('MMMM DD, YYYY')} <img className="clock-icon" src="/images/ui-icon/clock.svg" alt="" />{Moment.unix(start).format('HH-mm A')}</div>
		)
	}

	filterByUsername = e => {
		if (e.keyCode === 13) {
			this.props.filterByUsername(e)
		}
	}

	handlePageClick = e => {
		this.props.gotoPage(e.selected)
	}

	_head = () => {
		let _columns = []
		switch (this.props.activeType) {
			case VOLUNTEER:
				_columns = ["Full Name", "Date And Time", "Address", "Hours", "Status"]
				break;
			case DONATION:
				_columns = ["Full Name", "Date", "Donation Amount", "Status"]
				break;
			case PICKUP:
				_columns = ["Full Name", "Date And Time", "Address", "Items", "Status"]
				break;
			default:
				break;
		}
		let columns = _columns.map((e, i) => {
			return (<th key={i}>{ e }</th>)
		})
		return (<tr>{ columns }</tr>)
	}

	_rows = () => {
		const _this = this
		const {
			requests,
			activeType,
			rejectRequest
		} = this.props

		const rows = requests.rows || []

		return rows.map((e, i) => {
			if (activeType === VOLUNTEER) {
				return (
					<tr key={i}>
						<td><UserAvatar
								imgUser={e.user.avatar}
								imgUserType={e.user.role}
								userId={e.user._id}
							/>
							<span className="fullname">{ `${e.user.firstName} ${e.user.lastName}` }</span></td>
						<td>{ _this.getDuration(e.project.startDate, e.project.endDate) }</td>
						<td>{ e.user.address ? e.user.address : '' }</td>
						<td><span className="round-icon" /> { e.activeHours } Hours</td>
						<td>{ e.status === PENDING && <div className="button-group">
								<Button label="Accept" onClick={() => this.openConfirmModal(e)} />
								<Button label="Decline" onClick={() => rejectRequest(e)} inverse />
							</div> }
							{ e.status === ACCEPT && <span className="accept">Accepted</span> }
							{ e.status === REJECT && <span className="reject">Rejected</span> }
						</td>
					</tr>
				)
			}
			else if (activeType === DONATION) {
				return (
					<tr key={i}>
						<td><UserAvatar
								imgUser={e.user.avatar}
								imgUserType={e.user.role}
								userId={e.user._id}
							/>
							<span className="fullname">{ `${e.user.firstName} ${e.user.lastName}` }</span></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				)
			}
			else if (activeType === PICKUP) {
				return (
					<tr key={i}>
						<td><UserAvatar
								imgUser={e.user.avatar}
								imgUserType={e.user.role}
								userId={e.user._id}
							/>
							<span className="fullname">{ `${e.user.firstName} ${e.user.lastName}` }</span></td>
						<td>{ _this.getDuration(e.project.startDate, e.project.endDate, e) }</td>
						<td>{ e.user.address ? e.user.address : '' }</td>
						<td><span className="round-icon" /> { `${e.value} ${e.need.value}` }</td>
						<td>{ e.status === PENDING && <div className="button-group">
								<Button label="Accept" onClick={() => this.openConfirmModal(e)} />
								<Button label="Decline" onClick={() => rejectRequest(e)} inverse />
							</div> }
							{ e.status === ACCEPT && <span className="accept">Accepted</span> }
							{ e.status === REJECT && <span className="reject">Rejected</span> }
						</td>
					</tr>
				)
			}
			return (<tr key={i}></tr>)
		})
	}

	render() {

		let {
			showConfirmModal,
			pages,
			page
		} = this.state

		return (
			<div>
				<Modal title="Confirmation!" showModal={showConfirmModal} closeModal={this.closeConfirmModal}>
					<div className="confirmationModal">
						<h2 className="text-center main-font m-0">You can't reject once you accept it.</h2>
						<div className="separator-25" />
						<div className="button-group text-right">
							<Button
								label="Okay"
								padding="8px 16px"
								onClick={this.acceptRequest}
							/>
							<Button
								className="closeBtn"
								label="Cancel"
								inverse
								padding="8px 16px"
								onClick={this.closeConfirmModal}
							/>
						</div>
					</div>
				</Modal>
				<table className="RequestsTable">
					<thead>
						{this._head()}
					</thead>
					<tbody>
						<tr>
							<td><div className="FilterWrapper"><span className="search-icon"><img src="/images/ui-icon/search.svg" alt="Search Icon" /></span><input type="text" placeholder="Search..." className="InputFilter" onKeyDown={this.filterByUsername} /></div></td>
						</tr>
						{this._rows()}
					</tbody>
				</table>
				{pages > 1 &&
					<div className="text-right">
						<ReactPaginate
							previousLabel={'Prev'}
							nextLabel={'Next'}
							breakLabel={'...'}
							breakClassName={'break-me'}
							forcePage={page}
							pageCount={pages}
							marginPagesDisplayed={2}
							pageRangeDisplayed={3}
							onPageChange={this.handlePageClick}
							containerClassName={'pagination'}
							subContainerClassName={'pages pagination'}
							activeClassName={'active'}
						/>
					</div>
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestsTable)