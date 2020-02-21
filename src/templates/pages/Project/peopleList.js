import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import UserAvatar from '../../common/userComponents/userAvatar'
import Label from '../../common/Label'
import Button from '../../common/Button'
import Modal from '../../common/Modal'
import { PENDING, REJECT, ACCEPT } from '../../../helpers/participationTypes'

class peopleList extends Component {
	state={
		showConfirmModal: false,
		selectedNeed: null
	}

	closeConfirmModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showConfirmModal: false })
		}
	}

	openConfirmModal = need => e => {
		this.setState({ showConfirmModal: true, selectedNeed: need })
	}

	acceptRequest = e => {
		this.setState({ showConfirmModal: false }, () => {
			this.props.acceptRequest(this.state.selectedNeed)
		})
	}

	render() {
		const { 
			currentNeedPeoples,
			rejectRequest,
			loadMoreUsers,
			activeButtons,
			disableButtonLoad
		} = this.props
		
		const {
			showConfirmModal
		} = this.state
		
		return (
			<ul className="listOfPeople">
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
				{currentNeedPeoples.map(need => (
					<li key={need._id}>
						<NavLink
							to={`/${need.user._id}`}
							className="rowForUsersInActivity">
							<UserAvatar
								size={32}
								imgUser={need.user.avatar}
								imgUserType={need.user.role}
							/>
							<Label
								name={
									`${need.user.firstName} ${need.user.lastName} (${need.value + need.activeHours})`
								}
							/>
						</NavLink>
						{ need.status === PENDING && 
							<div className="button-group">
								<Button
									className="confirmRejectButton"
									label="Confirm"
									disabled={activeButtons}
									padding="8px 16px"
									onClick={this.openConfirmModal(need)}
								/>
								<Button
									className="confirmRejectButton"
									label="Deny"
									disabled={activeButtons}
									inverse
									padding="8px 16px"
									onClick={() => rejectRequest(need)}
								/>
							</div>
						}
						{ need.status === ACCEPT && <span className="badge main-font success">Accepted</span>}
						{ need.status === REJECT && <span className="badge main-font danger">Rejected</span>}
					</li>
				))}
				<Button
					className="loadMoreButton"
					label="Load more"
					disabled={disableButtonLoad()}
					padding="8px 16px"
					onClick={loadMoreUsers}
					solid
				/>
			</ul>
		)
	}
}

export default peopleList
