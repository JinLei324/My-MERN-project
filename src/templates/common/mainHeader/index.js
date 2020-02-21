import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

// import HeaderMenu from '../headerMenu'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getMyProfile } from '../../../actions/authActions';

// import Button from '../Button'
import { history } from '../../../store';
import { NONPROFIT } from '../../../helpers/userRoles';
import { getSearchByType, clearSearchByType } from '../../../actions/search';

import { signIn, signUp } from '../../common/authModals/modalTypes';
// import Modal from '../../common/Modal';

import HeaderMenu from '../headerMenu';
import MobileMenu from '../../app/landing/mainPageComponents/MobileMenu';

import UserAvatar from '../userComponents/userAvatar';

class MainHeader extends Component {

	state = {
		search: "",
		showSearchDialog: false,
		openSearch: false,
		isHome: false,
		showTopMenu: false,
		notificationShow: false,
		currentMenu: 'home'
	}

	allSearchClicked = false;

	constructor(props) {
		super(props);

		this.onMouseEnterOfMenu = this.onMouseEnterOfMenu.bind(this);
		this.onCloseMobileMenu = this.onCloseMobileMenu.bind(this);
		this.onBodyClickHandler = this.onBodyClickHandler.bind(this);
	}

	componentDidMount() {
		this.props.isAuth && this.props.getMyProfile();

		document.addEventListener('mousedown', this.onBodyClickHandler);
	}

	onBodyClickHandler = e => {
		if (this.allSearchClicked) {
			this.allSearchClicked = false;
			return;
		}

		this.setState({
			showSearchDialog: false
		});
	}

	onClickAllSearch = (e) => {
		this.allSearchClicked = true;

		e.stopPropagation();

		this.setState({ search: "" }, () => {
			this.getData();
		})
	}

	onClickSearchIcon = (e) => {
		e.stopPropagation();

		this.getData();
	}

	closeSearch = () => {
		this.setState({showSearchDialog: false, openSearch : false, search: ""});
	}

	handleChange = (e) => {
		this.setState({search: e.target.value}, () => {
			this.getData();
		})
	}

	getData = () => {
		this.props.getSearchByType({
            type: 0,
            skip: 0,
            limit: -1,
            search: this.state.search
		});
		
		this.setState({
			showSearchDialog: true
		});
	}

    handleKeyPress = (event) => {
        // if(event.key === 'Enter'){
		// 	this.setState({showSearchDialog: true})
		// 	this.getData();
        // }
	}

	onGoProfile = (userId) => {
		this.setState({search: "", showSearchDialog: false}, () => {
			this.props.clearSearchByType();
			this.props.push(`/${userId}`);
		})
	}

	onGoProject = (userId, projectId) => {
		this.setState({search: "", showSearchDialog: false}, () => {
			this.props.clearSearchByType();
			this.props.push(`/${userId}/project/${projectId}`);
		})
	}

	onExpandSearch = () => {
		this.setState({openSearch: true}, () => {
			let input = document.querySelector(".searchInput");
			input.focus();
		})
	}

	onMouseEnterOfMenu = e => {
		e.stopPropagation();
		this.setState({showTopMenu: !this.state.showTopMenu, notificationShow: false});
	}

	onClickSearch = e => {
		this.setState({showTopMenu: false, notificationShow: false});

		this.props.push(`/m-search`);
	}

	onCloseMobileMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showTopMenu: false, notificationShow: false});
	}

	render() {
		const { search, showTopMenu, currentMenu, showSearchDialog } = this.state;
		let { isAuth, user, searchResults, isHome, isScrollDown } = this.props;

		return (
			<header id="masthead" className={(isHome && !isScrollDown) ? 'header' : 'header fixed'}>
				<div className="header-top">
					<div className="cn">
						<div className={`header-top__logo ${isAuth ? 'loggedIn' : ''}`}>
							<div className="hidden">OneGivv</div>
							<div className="logo">
								<img 
									src="/images/ui-icon/logo.png"
									alt="logo"
									onClick={() => {
										this.setState({
											currentMenu: 'home'
										});
										(isAuth && user.role === NONPROFIT) ? 
											history.push(`/${user._id}/dashboard`) 
											: (isAuth && user.role !== NONPROFIT) ? history.push(`/${user._id}/news-feed`) : history.push('/')
									}}
								/>
							</div>
						</div>
						<nav className={`main-mnu hidden-md ${isAuth ? 'loggedIn' : ''}`}>
							<ul>
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'home' ? 'current-menu-item' : ''}`}>
										<NavLink to={`/`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'home'
											});
										}}>
											<span>Home</span>
										</NavLink>
									</li>
								}
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'nonprofit' ? 'current-menu-item' : ''}`}>
										<NavLink to={`/nonProfit`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'nonprofit'
											});
										}}>
											<span>Nonprofit</span>
										</NavLink>
									</li>
								}
								{ !isAuth &&
									<li className={`menu-item menu-item-has-children ${(currentMenu === 'learn' || currentMenu === 'about') ? 'current-menu-item' : ''}`}>
										<NavLink to={`/learn`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'learn'
											});
										}}>
											<span>Learn more</span>
										</NavLink>
										<ul className="sub-menu">
											<li className={`menu-item ${currentMenu === 'learn' ? 'current-menu-item' : ''}`}>
												<NavLink to={`/learn`} onClick={e => {
													e.stopPropagation();
													this.setState({
														currentMenu: 'learn'
													});
												}}>
													<span>Learn more</span>
												</NavLink>
											</li>
											<li className={`menu-item ${currentMenu === 'about' ? 'current-menu-item' : ''}`}>
												<NavLink to={`/about`} onClick={e => {
													e.stopPropagation();
													this.setState({
														currentMenu: 'about'
													});
												}}>
													<span>About Us</span>
												</NavLink>
											</li>
										</ul>
									</li>
								}
								<li className={`menu-item ${currentMenu === 'discovery' ? 'current-menu-item' : ''} ${isAuth ? 'loggedInDiscoveryMenu' : ''}`}>
									<NavLink exact to="/discovery" onClick={e => {
										e.stopPropagation();
										this.setState({
											currentMenu: 'discovery'
										});
									}}>
										<span>Discover</span>
										{ isAuth && <img src="/images/ui-icon/dropdown-arrow.svg" alt="dropdown-arrow" /> }
									</NavLink>
								</li>
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'blog' ? 'current-menu-item' : ''}`}>
										<NavLink
											to = {`/`}
											onClick = {e => {
												e.preventDefault();
												e.stopPropagation();

												this.setState({
													currentMenu: 'blog'
												});

												const win = window.open('https://medium.com/onegivv', '_blank');
												win.focus();
											}}>
												<span>Blog</span>
										</NavLink>
									</li>
								}
							</ul>
						</nav>

						<div className={`searchWrapper`}>
							<div className="search hidden-sm">
								<input
									type="search"
									className="search-field"
									placeholder="Search …"
									value={search}
									onChange={this.handleChange}
									onKeyPress={this.handleKeyPress}
									autoComplete="off"
									name="s"
									title="" />
								<button className="btn btn--search">
									<span className="icon-search"></span>
								</button>
							</div>

							{ showSearchDialog &&
								<div className="search-result main-font">
									<div className="all-result" onMouseDown={(e) => this.onClickAllSearch(e)}>
										<span className="_label">All results</span>
										<img className="_img" src="/images/ui-icon/dropdown.svg" alt="icon" />
									</div>
									<div className="search-body">
										{ searchResults.user.length !== 0 && <div className="group-label">People</div> }
										{ searchResults.user.length !== 0 && 
											searchResults.user.map((e, i) => {
												return (
													<div className="info-wrapper" key={e._id} onMouseDown={() =>this.onGoProfile(e._id) }>
														<UserAvatar
															imgUserType={e.role}
															imgUser={e.avatar}
															userId={e._id}
															size={40}
														/>
														<span className="label-name">{e.companyName || e.firstName + ' ' + e.lastName}</span>
													</div>
												)
											})										
										}
										{ searchResults.project.length !== 0 && <div className="group-label">Projects</div> }
										{ searchResults.project.length !== 0 && 
											searchResults.project.map((e, i) => {
												return (
													<div className="info-wrapper" key={e._id} onMouseDown={() => this.onGoProject(e.user._id, e._id)}>
														<UserAvatar
															imgUserType={e.user.role}
															imgUser={e.user.avatar}
															userId={e.user._id}
															size={40}
														/>
														<span className="label-name">{e.title}</span>
													</div>
												)
											})
										}
									</div>								
								</div>
							}
						</div>
						
						{ !isAuth &&
							<div>
								<div className={`btn btn--brdr btn--brdr-b log-in hidden-sm`} 
									onClick={e => history.push(`?modal=${signIn}`)}>
									Log in
								</div>
								<div className="btn btn--brdr btn--brdr-b sign-up hidden-sm" onClick={e => history.push(`?modal=${signUp}`)}>
									Signup
								</div>
								<div className="mobile-toggle">
									<span className={`toggle-mnu ${showTopMenu ? 'on' : ''}`} onClick={this.onMouseEnterOfMenu}>
										<span></span>
									</span>
								</div>
							</div>
						}
						
						{ isAuth &&
							<HeaderMenu isHome={isHome} isScrollDown={isScrollDown} />
						}

						{ !isAuth &&
							<MobileMenu 
								isAuth={isAuth} 
								user={user}
								isShow={showTopMenu}
								searchValue={search}
								onClickSearch={this.onClickSearch}
								onCloseMobileMenu={this.onCloseMobileMenu}
							/>
						}
					</div>
				</div>
			</header>
		)
	}
}

const mapStateToProps = ({ authentication, search }) => ({
	user: authentication.user,
	isAuth: authentication.isAuth,
	searchResults: search.searchResults
})

const mapDispatchToProps = {
	getMyProfile,
	push,
	getSearchByType,
	clearSearchByType
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainHeader)
