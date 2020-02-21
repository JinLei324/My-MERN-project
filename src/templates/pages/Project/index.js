import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import queryString from 'query-string';

import Header from './Header';
import Needs from './Needs';
// import Money from './Money';
import GivenResult from './GivenResult';
import StaticMap from './StaticMap';
import moment from 'moment';

import DonationProjectDetailCard from './DonationProjectDetailCard';

import { history } from '../../../store';

import {
	getProjectById,
	getProjectSubscription,
	clearProject,
	turnoffProject,
	cancelProject
} from '../../../actions/project';
import { VOLUNTEER, DONATION } from '../../../helpers/projectTypes';

import Card from '../../common/Card';

class Project extends Component {

	state = {
		isMy: false,
		isDonation: false,
		changeAuth: false,
		isEnd: false,
		isCancel: false,
		immediateDonation: false
	}

	componentDidMount() {
		const params = queryString.parse(this.props.location.search);
		if (params.immediateDonation) {
			this.setState({
				immediateDonation: true
			});
		}
		
		this.setState({ changeAuth: true });
		let { projectId } = this.props.match.params;
		this.props.getProjectById(projectId);
	}

	componentWillUnmount() {
		this.props.clearProject();
	}

	gotToEditProject = () => {
		let { id, projectId } = this.props.match.params;
		this.props.push(`/${id}/project/edit/${projectId}`);
	}

	checkDeadLinePlus = () => {
		/* UTC!!!! */
		let now = moment.utc(),
			start = moment(this.props.project.startDate * 1000)
				.subtract(1, 'h')
				.utc(),
			deadline = now.isAfter(start)

		return deadline
	}

	turnOnOffProject = (isTurnOff) => {
		const { userId } = this.props;
		let { projectId } = this.props.match.params;

		confirmAlert({
			title: 'Confirm to Turn ' + (isTurnOff ? 'On' : 'Off'),
			message: 'Are you sure you would like to turn ' +  (isTurnOff ? 'on' : 'off') +' this project ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						let data = { isTurnedOff: !isTurnOff };
						this.props.turnoffProject({
							...data,
							_id: projectId,
							userId: userId
						})
					}
				},
				{
					label: 'No',
					onClick: () => {
					}
				}
			],
			closeOnEscape: true,
			closeOnClickOutside: true,
		});
	}

	cancelProject = (isCancel) => {
		const { userId } = this.props;
		let { projectId } = this.props.match.params;

		confirmAlert({
			title: 'Confirm to ' + (isCancel ? 'Recover' : 'Cancel'),
			message: 'Are you sure you would like to ' + (isCancel ? 'recover' : 'cancel') + ' this project ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						let data = { isCancel: !isCancel };
						this.props.cancelProject({
							...data,
							_id: projectId,
							userId: userId
						})
					}
				},
				{
					label: 'No',
					onClick: () => {
					}
				}
			],
			closeOnEscape: true,
			closeOnClickOutside: true,
		});
	}

	followActionProject = (id, isFollow) => () =>
		this.props.getProjectSubscription({ id, isFollow });

	static getDerivedStateFromProps(props, state) {
		let newState = {};
		if (props.project && props.project.user) {
			newState.isMy = props.project.user._id === props.userId;
			newState.isDonation = props.project.projectType === 1;
			newState.isCancel = props.project.isCancel || false;
			let today = moment().format('X');
			if (Number(props.project.endDate) < Number(today)) {
				newState.isEnd = true;
			}
		}
		let isPaticipation = props.project.participation instanceof Array
		if (!isPaticipation && props.isAuth && state.changeAuth) {
			let { projectId } = props.match.params;
			state.changeAuth = false;
			props.getProjectById(projectId);
		}
		return newState;
	}

	onClickBack = e => {
		history.goBack();
	}

	render() {
		const { project, isAuth } = this.props;
		const { isMy, isDonation, isEnd, isCancel, immediateDonation } = this.state;
		
		return (
			<div className="relativeBlockforProjectWrapper">
				<div className={`mainBody ${project.projectType === DONATION ? 'withDonationCard' : ''}`}>
					{
						project && project.user && (
							<Card className={`project-wrapper ${project.projectType === DONATION ? 'withDonationCard' : ''}`}>
								<img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack} />
								<div className="separator-15" />
								<Header
									project={project}
									isMy={isMy}
									isAuth={isAuth}
									followActionProject={this.followActionProject}
									gotToEditProject={this.gotToEditProject}
									checkDeadLinePlus={this.checkDeadLinePlus}
									turnOnOffProject={this.turnOnOffProject}
									cancelProject={this.cancelProject}
									isDonation={isDonation}
									isEnd={isEnd}
									isCancel={isCancel}
									immediateDonation={immediateDonation}
								/>
								<div className="separator-15"></div>
								{ isDonation ?
									// <Money project={project} isMy={isMy} isEnd={isEnd} isCancel={isCancel} immediateDonation={immediateDonation} /> :
									<div></div> :
									<div>
										<Needs
											project={project}
											isMy={isMy}
											isEnd={isEnd}
											isCancel={isCancel}
										/>
										{ project.projectType === (VOLUNTEER) && <div>
											<p className="title main-font  text-center">Date and location</p>
											<p className="date-texts">
												<span className="date">
													{ moment(project.startDate * 1000).format(
														'dddd, MMMM Do YYYY'
													) }
													, from{' '}
													{ moment(project.startDate * 1000).format(
														'hh:mm a'
													) }{' '}
													to{' '}
													{ moment(project.endDate * 1000).format(
														'hh:mm a'
													) }
												</span>
												<span className="location">{ project.location && project.location.name }</span>
											</p>
											<StaticMap
												key={`${project.location.geo[0].lng}-${
													project.location.geo[1].lat
													}-${project.location.name}`}
												lat={project.location.geo[1]}
												lng={project.location.geo[0]}
												range={project.location.range}
												projectType={project.projectType}
												containerElement={
													<div style={{ height: `250px` }} />
												}
												mapElement={
													<div style={{ height: `100%` }} />
												}
											/>
										</div> }
									</div>
								}
								{ isDonation && project.projectType === DONATION && project.isFollow && project.donate_sum > 0 && <GivenResult project = { project } /> }
							</Card>
						)
					}

					{ project && project.user && project.projectType === DONATION && isDonation &&
						<DonationProjectDetailCard 
							project={project}
							isMy={isMy}
							isAuth={isAuth}
							followActionProject={this.followActionProject}
							gotToEditProject={this.gotToEditProject}
							checkDeadLinePlus={this.checkDeadLinePlus}
							turnOnOffProject={this.turnOnOffProject}
							cancelProject={this.cancelProject}
							isDonation={isDonation}
							isEnd={isEnd}
							isCancel={isCancel}
							immediateDonation={immediateDonation}
						/>
					}
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ authentication, project, preloader }) => ({
	user: authentication.user,
	userId: authentication.userId,
	isAuth: authentication.isAuth,
	project: project.openProject
})

const mapDispatchToProps = {
	getProjectById,
	clearProject,
	getProjectSubscription,
	push,
	turnoffProject,
	cancelProject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Project)