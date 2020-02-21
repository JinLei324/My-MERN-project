import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

// import Intercom from 'react-intercom';

import 'moment/locale/en-gb';

import { Hints } from 'intro.js-react';
import queryString from 'query-string';
import moment from 'moment';

import { history } from '../../../store';

import {
	getProjectByParams,
	getProjectSubscription,
	clearProjectsList
} from '../../../actions/project';
import { inviteNonprofit } from '../../../actions/user';
import {
	getGiveList,
	clearGiveList,
	getGiveCount
} from '../../../actions/give';
import { getUserProfile } from '../../../actions/followsAction';

import Card from '../../common/Card';
import Modal from '../../common/Modal';
import ProjectCard from '../../common/ProjectCard';
import Placeholder from '../../common/noContentPlaceholder';
import Button from '../../common/Button';
import CategoriesWrapper from '../../common/CategoriesWrapper';

import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes';
import { checkHint } from '../../../helpers/websocket';
import { NONPROFIT, DONOR, STUDENT } from '../../../helpers/userRoles';

import ProjectFilter from './filter';
import CharityFilter from './CharityFilter';
import RequestList from './RequestList';
import NonprofitsCategoriesToggle from './NonprofitsCategoriesToggle';
import TypeWrapper from './TypeWrapper';
import CategoryList from './CategoryList';
import NonprofitList from './NonprofitList';
import NonprofitsWeLove from './NonprofitsWeLove';

const projectTypes = [
	{ label: "All", index: -1 },
	{ label: "Volunteer", index: VOLUNTEER },
	{ label: "Donate", index: DONATION },
	{ label: "PickUp", index: PICKUP }
]

const donorProjectTypes = [
	{ label: "Charities", index: -1 },
	{ label: "Volunteer", index: VOLUNTEER },
	{ label: "Donate", index: DONATION },
	{ label: "PickUp", index: PICKUP }
]

class ProjectListPage extends Component {

	state = {
		isUserProjectsPage: /\/projects$/gi.test(history.location.pathname),
		isCurrentUserProjects: /\/projects\/current-user$/gi.test(
			history.location.pathname
		),
		isDiscoverPage: false,
		user: {},
		activeType: -1,		// -1 => Charities, -2 => Category List, -3 => Sub Category(Interest) List, -4 => Nonprofits We Love
		title: '',
		location: '',
		coordinates: [],
		interests: [],
		date: "",
		skip: 0,
		limit: 5,
		scrollRun: false,
		showInviteModal: false,
		inviteName: '',
		isFollow: false,
		searchUserId: '',
		createdBy: '',
		isRequestList: false,
		shouldClear: true,
		showUnverified: false,
		highlightWithRanges : [
			{ 
				"pickup-day": 
				[
					
				]
			},
			{ 
				"volunteer-day": 
				[
					
				]
			}
		],
		showHints: true,
		basicHints : [
			{
				id: 6,
				element: '.hint-all',
				hint: 'All',
				hintPosition: 'middle-left'
			},
			{
				id: 7,
				element: '.hint-upcoming-event',
				hint: 'From here you can view upcoming events for volunteering or for a PickUp you have requested.',
				hintPosition: 'bottom-right'
			},
			{
				id: 8,
				element: '.hint-my-project',	// nonprofit
				hint: 'My Projects is where you can manage all your projects. Create donation projects, volunteer opportunities and pick up request.',
				hintPosition: 'bottom-right'
			},
			{
				id: 9,
				element: '.hint-my-request',
				hint: 'My Request is where you can access all donor requests from volunteer work and PickUps!',
				hintPosition: 'bottom-right'
			},
			{
				id: 14,
				element: '.hint-add-project',
				hint: 'Create projects for volunteer opportunities, donation projects, and PickUp requests for supplies you need!',
				hintPosition: 'bottom-right'
			},
			{
				id: 21,
				element: '.hint-my-project',	// donor
				hint: "My Projects is where you can find updated information about projects you've given or volunteered to.",
				hintPosition: 'bottom-right'
			},
		],
		hints: [],
		onlyShowFutureProjects: false,
		selectedCategoryInfo: {
			_id: null,
			title: ''
		},
		selectedInterestInfo: {
			_id: null,
			title: ''
		},
		isFilterOpened: false,
		type: 'partial'
	}

	updateSearchValues = {}

	constructor(props) {
		super(props);

		this.onCharityClick = this.onCharityClick.bind(this);
		this.onClickEachInterest = this.onClickEachInterest.bind(this);
		this.updateFilterValues = this.updateFilterValues.bind(this);
		this.onSearchCharity = this.onSearchCharity.bind(this);
		this.readMore = this.readMore.bind(this);
	}

	static getDerivedStateFromProps(props, state) {
		const params = props.location && queryString.parse(props.location.search);
		if (params && params.type === 'volunteer') {
			state.activeType = VOLUNTEER;
			delete params.type;
			const stringified = queryString.stringify(params);
			props.history.push({
				pathname: props.location.pathname,
				search: stringified
			});
		}
		const currUsId = props.match.params.id;
		const myID = props.user && props.user._id;
		state.isOther = currUsId !== myID;

		if (state.isOther) {
			state.user = props.otherUser;
		} else {
			state.user = props.user;
		}
		
		if (params && params.view === 'request') {
			state.isRequestList = true;
		} else {
			state.isRequestList = false;
		}
		if (params && params.type) {
			state.activeType = parseInt(params.type);
			if (state.activeType === -2) {
				state.interests = [];
			}
		}
		if (params.future && params.future === 'true') {
			state.onlyShowFutureProjects = true;
		}

		if (params && params.categoryTitle) {
			state.selectedCategoryInfo = {
				title: decodeURIComponent(params.categoryTitle)
			};
			state.selectedInterestInfo = {
				title: decodeURIComponent(params.interestTitle)
			}
		}

		if (params && params.interest) {
			state.interests = [];
			state.interests.push(params.interest);
		}

		if (!currUsId) {
			state.user = props.user;
		}

		const isFollow = (state.isUserProjectsPage && props.user && props.user.role !== NONPROFIT) ? true : false;
		state.isFollow = isFollow;
		
		if (props.user && props.user.role === NONPROFIT && (state.isUserProjectsPage || state.isCurrentUserProjects)) {
			state.searchUserId = props.user._id;
		}
		if (params.createdBy && params.createdBy === 'true') {
			state.searchUserId = currUsId;
		}
		
		state.isDiscoverPage = !state.isUserProjectsPage && !state.isCurrentUserProjects;
		state.hints = [];
		if (!state.user)
			return state;
		if (state.isDiscoverPage || !state.isOther) {
			if (state.user && state.user.role === NONPROFIT) {
				if (!state.user.hints.includes(14)) {
					state.hints.push(state.basicHints[4]);
				}
			}
		}
		if (!state.isOther) {
			if (!state.isDiscoverPage) {
				if (state.isRequestList) {
					if (state.user && state.user.role === NONPROFIT) {
						if (!state.user.hints.includes(8)) {
							state.hints.push(state.basicHints[2]);
						}
					}
					if (state.user && state.user.role === NONPROFIT) {
						if (!state.user.hints.includes(8)) {
							state.hints.push(state.basicHints[2]);
						}
					} else {
						if (!state.user.hints.includes(21)) {
							state.hints.push(state.basicHints[5]);
						}
					}
				} else {
					if (state.user && state.user.role === NONPROFIT) {
						if (!state.user.hints.includes(9)) {
							state.hints.push(state.basicHints[3]);
						}						
					} else {
						if (!state.user.hints.includes(7)) {
							state.hints.push(state.basicHints[1]);
						}
					}
				}
			}
		}

		return state;
	}

	inviteChange = e => {
		this.setState({ inviteName: e.target.value })
	}

	componentDidMount() {
		const { authUser } = this.props;
		if (authUser) {
			window.Intercom('boot', {
				app_id: 'q4hnc1xx',
				email: authUser.email,
				user_id: authUser._id,
				created_at: authUser.createdAt
			});
		} else {
			window.Intercom('boot', {
				app_id: 'q4hnc1xx'
			});
		}
		
		this._mounted = true;
		
		this.getData();
		this.getGiveTotalCount();

		this.props.match.params.id &&
			this.props.getUserProfile(this.props.match.params.id);

		document.addEventListener('wheel', this.scrollUpload, false);
		document.addEventListener('touchstart', this.scrollUpload, false);
	}

	componentWillUnmount() {
		this._mounted = false;
		if (this.state.shouldClear) {
			this.props.clearGiveList();
			this.props.clearProjectsList();
		}
		
		document.removeEventListener('wheel', this.scrollUpload, false);
		document.removeEventListener('touchstart', this.scrollUpload, false);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			window.scrollTo(0, 0);
		}
	}

	currentPos = window.scrollY;
	scrollUpload = () => {
		let { skip } = this.state;

		if (this.state.activeType >= 0 &&
			document.body.clientHeight - 500 < window.scrollY + window.innerHeight &&
			( skip <= this.props.projects.length || skip <= this.props.giveList.length )
		) {
			this.getData();
		}
		this.currentPos = window.scrollY;
	}

	edit = (id, projectId) => () => {
		document.querySelector('html').scrollTop = 0;
		this.props.push(`/${id}/project/edit/${projectId}`);
	}

	readMore = (id, projectId) => () => {
		this.setState({shouldClear: false}, () => {
			document.querySelector('html').scrollTop = 0;
			this.props.push(`/${id}/project/${projectId}`);
		})
	}

	onCharityClick = id => e => {
		this.setState({shouldClear: false}, () => {
			document.querySelector('html').scrollTop = 0;
			this.props.push(`/${id}`);
		})
	}

	onClickEachInterest = (categoryInfo, interestInfo) => e => {
		if (e)
			e.stopPropagation();
		
		let encodedCategoryTitle = '';
		if (categoryInfo && categoryInfo.title) {
			encodedCategoryTitle = encodeURIComponent(categoryInfo.title);
		}

		let encodedInterestTitle = '';
		if (interestInfo && interestInfo.title) {
			encodedInterestTitle = encodeURIComponent(interestInfo.title);
		}

		this.props.push({
			pathname: this.props.location.pathname,
			search: "?type=-3&categoryTitle=" + encodedCategoryTitle + "&interestTitle=" + encodedInterestTitle + "&interest=" + interestInfo._id
		});
	}

	followActionProject = (id, isFollow) => () =>
		this.props.getProjectSubscription({ id, isFollow })

	getData = () => {
		let { skip, limit, activeType, title, location,
			coordinates, interests, date, searchUserId, isFollow, 
			isDiscoverPage, isRequestList, onlyShowFutureProjects, type } = this.state;
		
		let params = {
			skip,
			limit,
			activeType,
			title,
			interests,
			date,
			location,
			coordinates,
			userId: searchUserId,
			isFollow: isFollow,
			type: type
		}

		if (isDiscoverPage) {
			params.isActive = true;
		}
		if (onlyShowFutureProjects) {
			params.isActive = true;
		}

		if (isRequestList) {
			this.getGiveList();
		} else {
			this.props.getProjectByParams(params);
		}
		
		this.setState({
			skip: skip + limit
		});
	}

	getGiveTotalCount = () => {
		if (this.props.authUser)
			this.props.getGiveCount();
	}

	getGiveList = () => {
		let { skip, limit} = this.state;
		this.props.getGiveList({
			skip, 
			limit,
			cb: () => {
				var mapList = this.props.giveList.map( (give) => {
					return { type: give.type, giveAt: moment.unix(give.giveAt) }
				})
				var volList = mapList.filter( (g) => {
					return g.type === VOLUNTEER
				}).map( (g) => { return g.giveAt } )

				var pickList = mapList.filter( (g) => {
					return g.type === PICKUP
				}).map( (g) => { return g.giveAt } )
				
				var highlightWithRanges = [
					{ 
						"pickup-day": pickList
					},
					{ 
						"volunteer-day": volList
					}
				]
				this.setState({ highlightWithRanges })
			}
		})
		this.setState({
			skip: skip + limit
		})
	}

	inputHelper = (key, val) => () => {
		if (key === 'activeType' && val !== this.state.activeType) {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=" + val
			});
			this.setState({
				skip: 0,
				interests: []
			}, () => {
				this.getData()
			});

			this.setState({isFilterOpened: false})
		}
	}

	getProjects = data => {
		this.setState({ ...data, skip: 0 }, () => {
			// this.props.clearProjectsList();
			this.getData();
		})
	}

	getUsers = data => {
		this.setState({
			...data
		});
	}

	showInviteModal = e => {
		this.setState({showInviteModal: true})
	}

	closeInviteModal = e => {
		this.setState({showInviteModal: false})
	}

	onClickInviteNonProfit = e => {
		if (e)
			e.stopPropagation();

		const { inviteName } = this.state;
		this.props.inviteNonprofit(inviteName);
		this.setState({ showInviteModal: false });
	}

	onClickRequest = e => {
		if (e)
			e.stopPropagation();

		if (!this.state.isRequestList) {
			this.props.push(`/${this.props.userId}/projects?view=request`);
			this.setState({skip: 0}, ()=> {
				// this.props.clearProjectsList();
				// this.props.clearGiveList();
				this.getData();
			})
		} else {
			this.props.push(`/${this.props.userId}/projects?view=project`);
			this.setState({skip: 0}, ()=> {
				// this.props.clearProjectsList();
				// this.props.clearGiveList();
				this.getData();
			})
		}
	}

	onCloseHint = idx => e => {
		if (e)
			e.stopPropagation();

		if (!this._mounted)
			return;
		const { hints } = this.state
		const hId = hints[idx].id
		checkHint(hId)
	}

	onClickAddProject = id => e => {
		if (e)
			e.stopPropagation();

		if (this.state.user.isApproved)
			this.props.push(`/${id}/project/create`);
		else
			this.setState({showUnverified: true})
	}

	onClickBack = e => {
		if (this.state.activeType === -2) {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=-1"
			});
		} else if (this.state.activeType === -3) {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=-2"
			});
		} else if (this.state.activeType === -4) {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=-1"
			});
		} else {
			this.props.push(`/${this.state.searchUserId}`);
		}
	}

	onCategoryCheckedChanged = checkedInterests => {
		this.setState({
			interests: checkedInterests
		});
	}

	onClickNonprofits = e => {
		this.setState({
			activeType: -4
		}, () => {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=-4"
			});
		});
	}

	onClickCategories = e => {
		this.setState({
			activeType: -2
		}, () => {
			this.props.push({
				pathname: this.props.location.pathname,
				search: "?type=-2"
			});
		});
	}

	updateFilterValues = updateValues => {
		this.updateSearchValues = updateValues;
		this.setState({
			type: 'all'
		});
	}

	toggleFilterPanel = isFilterOpened => {
		this.setState({ isFilterOpened: isFilterOpened });
	}

	onSearchCharity = e => {
		if (e) {
			e.stopPropagation();
		}
		
		this.setState({
			skip: 0,
			...this.updateSearchValues
		}, () => {
			if (this.state.activeType >= 0) {
				this.getData({
					title: this.updateSearchValues.title,
					date: this.updateSearchValues.date,
					coordinates: [],
					interests: this.updateSearchValues.interests
				});
			}
		});
	}

	render() {
		const {
			activeType,
			isUserProjectsPage,
			isCurrentUserProjects,
			user,
			showInviteModal,
			inviteName,
			isDiscoverPage,
			isRequestList,
			highlightWithRanges,
			hints,
			showHints,
			showUnverified,
			selectedCategoryInfo,
			selectedInterestInfo,
			title,
			location,
			interests,
			isFilterOpened
		} = this.state;

		const { projects, userId, authUser, giveCount, giveList } = this.props;

		let authUserInfo = {}
        if (!authUser) {
            authUserInfo = {
                role: DONOR
            };
        } else {
            authUserInfo = authUser;
        }

		// let userInfo = {};
		// if (authUser) {
		// 	userInfo = {
		// 		user_id: authUser._id,
		// 	 	email: authUser.email,
		// 		name: authUser.companyName || authUser.firstName + authUser.lastName
		// 	};
		// 	console.log('user name : ', userInfo.name);
		// }

		return (
			<div className={`projectListPage ${(activeType === -2 || activeType === -3 || activeType === -4) ? 'smallWidth' : ''}`}>
				{/* { !authUser && <Intercom appID="q4hnc1xx" /> }
				{ authUser && <Intercom appID="q4hnc1xx" { ...userInfo } /> } */}

				<section className={`projectListSection`}>
					<Modal title="Oops, you`re currently not verified. Please check home page for verification status." 
						showModal={showUnverified} 
						closeModal={() => this.setState({showUnverified: false})} />
					<Hints 
						enabled={showHints}
						hints={hints}
						onClose={this.onCloseHint}
						ref={hints => this.hintRef = hints}
					/>

					{ activeType >= -1 && user && user._id === userId && user.role === NONPROFIT &&
						<Button className="hint-add-project" label="Add Project" padding="10px 20px" onClick={this.onClickAddProject(user._id)}>
						</Button> }

					<section className="titleSection">
						{ ( (user && user._id !== userId && isCurrentUserProjects) || activeType < -1 ) &&
							<img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack}/>
						}

						{ activeType === -2 &&
							<div className="topTitle">
								<p className="title">Categories</p>
							</div>
						}

						{ activeType === -3 &&
							<div className="topTitle">
								<p className="title">{ selectedCategoryInfo.title } Categories</p>
								<p className="subTitle">{ selectedInterestInfo.title }</p>
							</div>
						}

						{ activeType === -4 &&
							<div className="topTitle">
								<p className="title">Nonprofits We Love</p>
							</div>
						}
					</section>

					{ activeType >= -1 &&
						<TypeWrapper 
							user={user}
							isDiscoverPage={isDiscoverPage}
							projectTypes={projectTypes}
							donorProjectTypes={donorProjectTypes}
							inputHelper={this.inputHelper}
							activeType={activeType} />
					}
					{ activeType >= -1 && 
						<div className={`filterCategoryWrapper onlyShowInMobile ${ !isUserProjectsPage ? 'discover-page' : '' }`}>
							<div className={`filterWrapper ${(isUserProjectsPage && activeType === -1) ? '' : 'noPadding'}`}>
								{ isUserProjectsPage && activeType === -1 &&
									<Card
										className={`my-request-wrapper ${isRequestList ? 'hint-my-project' : user.role === NONPROFIT ? 'hint-my-request' :'hint-upcoming-event'}`}
										padding="9px"
										onClick={this.onClickRequest}>
										<span className="label">{isRequestList ? 'My Projects' : user.role === NONPROFIT ? 'My Request' :'Upcoming Events' }</span>
										{ giveCount > 0 && <span className="count">{giveCount}</span> }
									</Card>
								}
								{ isDiscoverPage && (activeType === -1 || activeType === -3 || activeType === -4) &&
									<CharityFilter
										getData={this.getUsers}
										updateFilterValues={this.updateFilterValues}
										toggleFilterPanel={this.toggleFilterPanel}
										isMobile={true} />
								}
								{ ((isDiscoverPage && activeType >= 0) || isUserProjectsPage) &&
									<ProjectFilter
										getData={this.getProjects}
										isDiscoverPage={isDiscoverPage && activeType === -1}
										updateFilterValues={this.updateFilterValues}
										toggleFilterPanel={this.toggleFilterPanel}
										isMobile={true} />
								}
								{ isUserProjectsPage &&
									<div className="separator-h-10"></div>
								}
							</div>
							<CategoriesWrapper 
								isFilterOpened={isFilterOpened}
								onSearchCharity={this.onSearchCharity}
								onCategoryCheckedChanged={this.onCategoryCheckedChanged} />
						</div>
					}
					{ activeType >= -1 &&  isRequestList && 
						<RequestList 
							highlightWithRanges={highlightWithRanges}
							giveList={giveList}
							user={user} />
					}
					
					{ activeType >= -1 && !isUserProjectsPage && isDiscoverPage &&
						<NonprofitsCategoriesToggle
							onClickNonprofits={this.onClickNonprofits}
							onClickCategories={this.onClickCategories}
							activeType={activeType} />
					}
					
					{ !isRequestList && (!isDiscoverPage || ( isDiscoverPage && activeType >= 0) ) && projects.length !== 0 &&
						projects.map((e, i) => (
							<Fragment key={e._id}>
								<ProjectCard
									{...e}
									editAction = {
										e.user && e.user._id === userId
											? this.edit(userId, e._id)
											: null
									}
									isMy = {e.user && e.user._id === userId}
									isUserProjectsPage = {isUserProjectsPage}
									readMore = {this.readMore(e.user ? e.user._id : "", e._id)}
									followActionProject={this.followActionProject(
										e._id,
										e.isFollow
									)}
									authUser={authUserInfo}
								/>
								<div className="separator-15" />
							</Fragment>	
						)
					) }

					{ activeType === -2 &&
						<CategoryList onClickEachInterest={this.onClickEachInterest} />
					}

					{ !isRequestList && isDiscoverPage && (activeType === -1 || activeType === -3) && 
						<NonprofitList 
							title={title} 
							location={location} 
							interests={interests} 
							onCharityClick={this.onCharityClick}
							activeType={activeType}
						/>
					}

					{ !isRequestList && isDiscoverPage && activeType === -4 && 
						<NonprofitsWeLove title={title} location={location} interests={interests} onCharityClick={this.onCharityClick}  />
					}
					
					{/* { projects.length === 0 && !isUserProjectsPage && !isDiscoverPage && activeType >= 0 && */}
					{ projects.length === 0 && (isUserProjectsPage || isDiscoverPage) && activeType >= 0 &&
						<Placeholder
							titleMain={`There are currently no ${
								activeType === -1
									? ''
									: activeType === VOLUNTEER
										? 'volunteer projects'
										: activeType === DONATION
											? 'donation projects'
											: activeType === PICKUP
												? 'PickUp requests'
												: ''
							} found`}
						/>
					}
					
					{ activeType >= -1 && !isRequestList && projects.length === 0 && isUserProjectsPage &&
						<Placeholder
							titileButton={'Discover your interests'}
							onClickAction={() =>
								history.push('/discovery?type=volunteer')
							}
							titleMain={`You do not follow any ${
								activeType === -1
									? ''
									: activeType === VOLUNTEER
										? 'volunteer'
										: activeType === DONATION
											? 'donation'
											: activeType === PICKUP
												? 'PickUp'
												: 'any'
							} projects`}
						/>
					}
					{ activeType === -1 && !isRequestList && projects.length === 0 && isCurrentUserProjects &&
						<Placeholder
							titileButton={`${userId ? 'Create one now!' : ''}`}
							onClickAction={
								userId &&
								(e => history.push(`/${userId}/project/create`))
							}
							titleMain={
								user._id
									? `${
											userId === user._id
												? 'You'
												: user.companyName
													? user.companyName
													: user.firstName +
													' ' +
													user.lastName
									} ${
										userId === user._id ? 'have' : 'has'
									} not created any projects`
									: ''
							}
						/>
					}
					
					{ activeType >= -1 && !isRequestList && projects.length === 0 && 
						user && (user.role === DONOR || user.role === STUDENT) &&
						<div className ="row text-center btn-group">
							<Button
								className="btn-invite"
								padding="10px 24px"
								label="Invite Nonprofit"
								onClick={this.showInviteModal}
								solid
							/>
						</div>
					}
					<Modal
						title="Invite Nonprofits"
						showModal={showInviteModal}
						closeModal={this.closeInviteModal} width="350px">
						<div className="input-name">
							<input className="_input main-font" placeholder="Enter nonprofit name" value={inviteName} onChange={this.inviteChange}/>
						</div>
						<div className="bottom-box">
							<Button
								onClick={this.onClickInviteNonProfit}
								className="invite"
								label="Invite"
								padding="10px 31px"
								disabled ={!inviteName}
							/>
						</div>
					</Modal>
				</section>
				{ activeType >= -1 && 
					<section className="filterCategorySection">
						<div className={`filterCategoryWrapper ${ !isUserProjectsPage ? 'discover-page' : '' }`}>
							<div className={`filterWrapper ${(isUserProjectsPage && activeType === -1) ? '' : 'noPadding'}`}>
								{ isUserProjectsPage &&
									<Card
										className={`my-request-wrapper ${isRequestList ? 'hint-my-project' : user.role === NONPROFIT ? 'hint-my-request' :'hint-upcoming-event'}`}
										padding="9px"
										onClick={this.onClickRequest}>
										<span className="label">{isRequestList ? 'My Projects' : user.role === NONPROFIT ? 'My Request' :'Upcoming Events' }</span>
										{ giveCount > 0 && <span className="count">{giveCount}</span> }
									</Card>
								}

								{ isDiscoverPage && (activeType === -1 || activeType === -3 || activeType === -4) && 
									<CharityFilter
										getData={this.getProjects}
										updateFilterValues={this.updateFilterValues}
										isMobile={false} />
								}
								{ ((isDiscoverPage && activeType >= 0) || isUserProjectsPage) &&
									<ProjectFilter
										getData={this.getProjects}
										isDiscoverPage={isDiscoverPage && activeType === -1}
										updateFilterValues={this.updateFilterValues}
										isMobile={false} />
								}
								{ isUserProjectsPage && 
									<div className="separator-h-10"></div>
								}
							</div>
							<CategoriesWrapper 
								isFilterOpened={true}
								onSearchCharity={this.onSearchCharity}
								onCategoryCheckedChanged={this.onCategoryCheckedChanged} />
						</div>
					</section>
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	userId: state.authentication.userId,
	authUser: state.authentication.user,
	otherUser: state.follows.userInfo,
	projects: state.project.projects,
	giveList: state.give.giveList,
	giveCount: state.give.totalCount
})

const mapDispatchToProps = {
	getProjectByParams,
	getProjectSubscription,
	clearProjectsList,
	push,
	getUserProfile,
	getGiveList,
	clearGiveList,
	getGiveCount,
	inviteNonprofit
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectListPage)
