import React, { Component } from 'react';
import { connect } from 'react-redux';

import NumberFormat from 'react-number-format';

import { DONATION } from '../../../../helpers/projectTypes';
import { NONPROFIT } from '../../../../helpers/userRoles';

import Button from '../../../common/Button';
import MoneyDonationModal from '../MoneyDonationModal';

class Money extends Component {

	state = {
		showMoneyDonationModal: false
	}

	loadDonors = () => {

	}

	onGive = e => {
		e.preventDefault();

		this.setState({ showMoneyDonationModal: true });
	}

	closeMoneyDonationModal = e => {
		this.setState({ showMoneyDonationModal: false });
	}

	render() {
		const { showMoneyDonationModal } = this.state;

		const {
			isEnd,
			isCancel,
			project,
			isMy,
			user
		} = this.props;
		
		let proc = (project.money.current / project.money.total) * 100;

		return (
			<div className="projectMoney">
				<MoneyDonationModal project={project} showModal={showMoneyDonationModal} closeModal={this.closeMoneyDonationModal} />
				<div className={`activiti-wrapper myTabs donation ${project.money.total_applicants === 0 && 'empty'} ${proc >= 100 && 'full'}`}>
					<div className="clickedPart" onClick={() => this.loadDonors() }>
						<div className="progressBar">
							<div className="progress-wrapper">
								<div className="progress">
									<div
										className="progress-contain"
										style = {{
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
						<div className="values">
							<span className="current">
								{ (project.projectType === DONATION) ? 
									<NumberFormat value={project.money.current} displayType={'text'} thousandSeparator={true} prefix={'$'} /> : 
									<NumberFormat value={project.money.current} displayType={'text'} thousandSeparator={true} prefix={''} /> 
								}
							</span>&nbsp;&nbsp;&nbsp;
							<span className="goal">
								Raised of&nbsp;
								{ (project.projectType === DONATION) ? 
									<NumberFormat value={project.money.total} displayType={'text'} thousandSeparator={true} prefix={'$'} /> : 
									<NumberFormat value={project.money.total} displayType={'text'} thousandSeparator={true} prefix={''} />
								}&nbsp;
								goal
							</span>
						</div>
						<div className="statusBody">
							<div className="donors">
								<p className="value">{project.money.total_applicants}</p>
								<p className="caption">Donors</p>
							</div>
							<div className="shares">
								<p className="value">{project.shares}</p>
								<p className="caption">Shares</p>
							</div>
							<div className="followers">
								<p className="value">{project.followers}</p>
								<p className="caption">Followers</p>
							</div>
						</div>
						{ (!user || (!isMy && user && user.role !== NONPROFIT)) &&
							<div className="give-button">
								<Button
									label="Donate"
									onClick={this.onGive}
									solid
									disabled={isEnd || isCancel}
								/>
							</div>
						}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ authentication, project }) => ({
	user: authentication.user,
	userId: authentication.userId,
	isAuth: authentication.isAuth
})

const mapDispatchToProps = {
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Money)