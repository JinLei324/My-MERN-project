import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import moment from 'moment';

import { signIn, signUp } from '../../common/authModals/modalTypes'

import { logout } from '../../../actions/authActions'
import IconButton from '../IconButton'
import Button from '../Button';
import Card from '../Card';
import { NONPROFIT  } from '../../../helpers/userRoles'
import FollowNoti from './FollowNoti';
import NotifyItem from './NotifyItem';
import { history } from '../../../store';
import SearchBox from '../SearchBox';

import {
	updateFollowStatus
} from '../../../actions/followsAction'
import {
	updateNotification,
	readNotificationList,
	setUnreadNotifyCount
} from '../../../actions/global'
import {
	listenNotification,
	listenFollowRequest
} from '../../../helpers/websocket'
import {
	notificationFollow,
	notificationFollowing,
	notificationUnFollow
} from '../../../actions/authActions'
import {
	getPostLike,
    commentPost,
	getPostById,
	closePost,
	sharePost
} from '../../../actions/post'
import PostCard from '../PostCard'
import { ACCEPT, REJECT } from '../../../helpers/followStatus';
import { FollowAccept, FollowRequest, UnFollow, LikeOnPost, CommentOnPost, FollowDecline, SharedOnPost, SharedOnProject } from '../../../helpers/notificationType';
import Modal from '../Modal';

class HeaderMenu extends Component {

	state = {
		showTopMenu: false,
		showSideMenubar: false,
		notificationShow: false,
		notificationTab: 1,
		notifications: [],
		pendingFriends: [],
		hints: [
			{
				element: '.hint-search-box',
				hint: 'Loral Ipsum',
				hintPosition: 'middle-left'
			}
		],
		showHints: false,
		dropdownOpen: false
	}

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.state = {
			dropdownOpen: false
		};
  	}

	componentDidMount() {
		this._mounted = true;

		window.addEventListener('scroll', (e) => {
			if (this.state.showTopMenu) {
				this.setState({showTopMenu: false});
			}
		})

		this.setActiveCampaign(this.props.history.location.pathname)
		this.props.history.listen(location => {
			this.hideSideMenubar()
			this.setState({ showCampaignsSubmenu: false })
			this.setActiveCampaign(location.pathname)
		})
		
		listenNotification((data)=> {
			let { notifications } = this.state;
			notifications.unshift(data);

			if (this._mounted)
				this.setState({notifications});

			this.props.dispatch(setUnreadNotifyCount({unreadNotify: this.props.unreadNotify + 1}))
			if (data.type === FollowAccept) {
				//   following + 1
				this.props.dispatch(notificationFollow())
			} else if (data.type === FollowRequest && this.props.user.role === NONPROFIT) {
				// follower + 1
				this.props.dispatch(notificationFollowing())
			} else if (data.type === UnFollow) {
				// following - 1 
				this.props.dispatch(notificationUnFollow())
			}
		})

		listenFollowRequest((data) => {
			let { pendingFriends } = this.state;
			pendingFriends.unshift(data)
			this.setState({pendingFriends})
		})
		window.addEventListener('click', this.close)
		const side = document.querySelector(".sideMenubar")
		side.addEventListener('click', e => {
			e.stopPropagation()
		})
	}

	componentWillUnmount() {
		this._mounted = false;

		window.removeEventListener('click', this.close)
	}

	close = e => {
		if (this._mounted)
			this.setState({ notificationShow: false, showTopMenu: false});

		if (this.state.showSideMenubar)
			this.toggleSideMenubar(e)
	}

	static getDerivedStateFromProps(props, state) {
		state.notifications = props.notifications
		state.pendingFriends = props.pendingFriends

		return state
	}

	setActiveCampaign = (path) => {
		if (!this._mounted) return;

		if (path.includes('campaigns')) {
			let paths = path.split('/')
			this.setState({ campaignName: paths[paths.length - 1] })
		}
		else {
			this.setState({ campaignName: "" })
		}
	}

	toggleSideMenubar = e => {
		if (this._mounted)
			this.setState({showSideMenubar: !this.state.showSideMenubar});

		const appCon = document.querySelector('.app');
		if (appCon && appCon.classList)
			appCon.classList.toggle('open-sidemenu')

		e.stopPropagation();
	}

	hideSideMenubar = e => {
		if (this._mounted)
			this.setState({ showSideMenubar: false });

		const appCon = document.querySelector('.app');
		if (appCon && appCon.classList)
			appCon.classList.remove('open-sidemenu')
	}

	toggleCampaignsSubmenu = e => {
		e.preventDefault();

		if (this._mounted) {
			this.setState(prevState => ({
				showCampaignsSubmenu: !prevState.showCampaignsSubmenu
			}));
		}
	}

	onMouseEnterOfMenu = e => {
		e.stopPropagation();

		if (this._mounted) {
			this.setState({showTopMenu: !this.state.showTopMenu, notificationShow: false})
		}
	}

	logout = e => {
		e.stopPropagation();

		if (this._mounted)
			this.setState({showTopMenu: false});

		this.props.dispatch(logout())
	}

	toggleNotification = e => {
		e.stopPropagation();
		
		if (this._mounted) {
			this.setState((state) => ({
				notificationShow: !state.notificationShow,
				showTopMenu: false,
				notificationTab: 0
			}), () => {
				const { notificationShow, notificationTab } = this.state;
				if (notificationShow && notificationTab === 0) {
					// this.readNotifications();
			   }
			});
		}
	}

	readNotifications = () => {
		// if (this.props.unreadNotify > 0)
			this.props.dispatch(readNotificationList())
	}

	onAccept = _id => e => {
		this.props.dispatch(notificationFollowing())
		e.stopPropagation()
		this.props.dispatch(updateFollowStatus({_id: _id, status: ACCEPT}))
	}

	onDecline = _id => e => {
		e.stopPropagation()
		this.props.dispatch(updateFollowStatus({_id: _id, status: REJECT}))
	}

	onDelete = _id => e => {
		e.stopPropagation()
		this.props.dispatch(updateNotification({ _id: _id, isRemoved: true }))
	}

	onClickNotTab = tab => e => {
		e.stopPropagation();

		if (this._mounted) {
			this.setState({notificationTab: tab}, () => {
				if (this.state.notificationShow && this.state.notificationTab === 0) {
				}
			});
		}
	}
	
	onClickSearch = e => {
		this.props.history.push('/m-search');
	}

	onClickNotifyItem = notify => e => {
		if (e)
			e.stopPropagation();

		const { user } = this.props;

		if (this._mounted)
			this.setState({ notificationShow: false });

		switch (notify.type) {
			case LikeOnPost:
			case CommentOnPost:
			case SharedOnPost:
			case SharedOnProject:
				if (notify.post && notify.post._id) {
					this.props.dispatch(getPostById({_id: notify.post._id}));
				}
				
				this.props.history.push('/' + user._id);
				break;	
			case FollowRequest:
			case UnFollow:
			case FollowAccept:
			case FollowDecline:
				this.props.history.push('/' + notify.user._id);
				break;
			default:
				break;
		}

		this.props.dispatch(updateNotification({ _id: notify._id, isRead: true }));
	}

	onCloseNotifyItem = notify => e => {
		if (e)
			e.stopPropagation();

		if (this._mounted)
			this.setState({ notificationShow: false });

		this.props.dispatch(updateNotification({ _id: notify._id, isRead: true }));
	}

	closePostModal = () => {
		this.props.dispatch(closePost());
	}
	
	onClickPostLike = post => {
        if (this.props.user) {
            this.props.dispatch(getPostLike({
				id: post._id,
				isLike: post.isLike
			}));
        } else {
            this.props.history.push(`?modal=${signIn}`);
        }
	}
	
	onClickPostShare = post => {
        if (this.props.user) {
            this.props.dispatch(sharePost({
                id: post._id,
				isShared: post.isShared,
				userId: post.selectedUserId
            }));
        } else {
            this.props.history.push(`?modal=${signIn}`);
        }
    }

    onComment = (postId, parent, text, file) => {
        this.props.dispatch(commentPost({
            id: postId,
            text: text,
            file: file,
            parent: parent
        }));
	}

	onClickSupport = post => {
		this.props.dispatch(closePost());
        this.props.history.push(`/${post.user._id}/project/${post.project._id}`);
	}

	onClickShowDeleteModal = (e, pId) => {
        e.stopPropagation();
    }
	
	onClickEditPost= (event, post) => {
        event.stopPropagation();
        if (post.project) {
        } else {
			this.props.dispatch(getPostById({_id: post._id, edit: true}));
        }
    }
	
	onClickHelp = e => {
		window.Tawk_API.toggle();
	}

	toggle() {
		if (!this._mounted) return;

		this.setState(prevState => ({
			dropdownOpen: !prevState.dropdownOpen
		}));
  	}

  	onMouseEnter() {
		if (!this._mounted) return;

    	this.setState({ dropdownOpen: true });
  	}

  	onMouseLeave() {
		if (!this._mounted) return;

    	this.setState({ dropdownOpen: false });
	}
	
	open = dropdownOpen => e => {
		e.stopPropagation();

		if (!this._mounted) return;

		this.setState({ dropdownOpen });
	}

	render() {
		const { showTopMenu, showSideMenubar, notificationTab, notificationShow, notifications, pendingFriends/*, dropdownOpen*/ } = this.state;
		const { isAuth, user, openedPost, editPost, unreadNotify, /*isHome, isScrollDown*/ } = this.props;

		let newNotifications = notifications.filter(notifications => notifications.isRead === false);
		newNotifications.sort((a, b) => moment(a.createdAt) < moment(b.createdAt) ? 1 : -1 );

		let viewedNotifications = notifications.filter(notifications => notifications.isRead === true);
		viewedNotifications.sort((a, b) => moment(a.viewedAt) < moment(b.viewedAt) ? 1 : -1);
		
		return (
			<nav className="headerMenu">
				{ isAuth && user &&
					<div className="wrapper">
						<div className="noti-icon">
							<div className="menu-notify" onClick={ this.toggleNotification }></div>
							{ (unreadNotify + pendingFriends.length) > 0 && 
								<span className="notify-count" onClick={ this.toggleNotification }>{ unreadNotify + pendingFriends.length }</span> }
							<section className={`notify-list ${notificationShow ? 'open' : ''}`} onClick={ e => e.stopPropagation() }>
								<div className="title-row">
									<div className="_title">Activity</div>
									<div className="noti-type">
										<span className={`noti-but noti ${notificationTab === 0 ? 'active': ''}`} onClick={ this.onClickNotTab(0) }>
											<div className="_icon noti"></div>
											{ unreadNotify > 0 && <span className="_count">{ unreadNotify }</span> }
										</span>
										<span  className={`noti-but ${notificationTab === 1 ? 'active': ''}`} onClick={ this.onClickNotTab(1) }>
											<div className="_icon add"></div>
											{ pendingFriends.length > 0 && <span className="_count">{pendingFriends.length}</span> }
										</span>
									</div>
								</div>
								{ notificationTab === 1 && <div className="follow-list">
									{ pendingFriends.length !== 0 && pendingFriends.map((e, i) => {
										return (
											<FollowNoti key={e._id} user={e.follower} createdAt={e.createdAt} _id={e._id} onAccept={this.onAccept} onDecline ={this.onDecline} />
										)
									}) }
								</div> }
								{ notificationTab === 0 && <div className="notification-list">
									<section>
										<p className='notification-type-title'>New Notification</p>
										{ newNotifications.length !== 0 && newNotifications.map((e, i) => {
											return (
												<NotifyItem key={e._id} {...e} 
													onDelete={this.onDelete} 
													onClickItem={this.onClickNotifyItem(e)}
													onCloseItem={this.onCloseNotifyItem(e)}
												/>
											)
										}) }
									</section>
									<section>
										<p className='notification-type-title'>Viewed</p>
										{ viewedNotifications.length !== 0 && viewedNotifications.map((e, i) => {
											return (
												<NotifyItem key={e._id} {...e} 
													onDelete={this.onDelete} 
													onClickItem={this.onClickNotifyItem(e)}
													onCloseItem={this.onCloseNotifyItem(e)}
												/>
											)
										}) }
									</section>
								</div> }
							</section>
						</div>
						{ isAuth && user &&
							<NavLink
								to={`/${user && user._id}`}
								onClick={e => e.stopPropagation()}>
								<div className="info-wrapper mobile-view">
									<span className="user" />
								</div>
							</NavLink> }
						<div className={`toggleBlockForMenu desktop ${showTopMenu ? 'open' : ''}`} onClick={this.onMouseEnterOfMenu}>
							<span className="hamburger" />
						</div>
						<div className="show-mobile">
							<div className="menu-toggle" onClick={this.toggleSideMenubar}></div>
						</div>
					</div> 
				}

				{/* { !isAuth && 
					<div>
						<div className="hide-mobile">
							<div className="wrapper hide-mobile">
								<NavLink
									to={`/`}
									onClick={e => e.stopPropagation()}>
									<span className={(isHome && !isScrollDown) ? "guest-menu" : "guest-menu"}>Home</span>
								</NavLink>
								<NavLink
									to={`/nonProfit`}
									onClick={e=>e.stopPropagation()}>
										<span className={(isHome && !isScrollDown) ? "guest-menu" : "guest-menu"}>Nonprofit</span>
								</NavLink>
								<section 
									className={`drop-down-menu`} 
									onMouseOver={this.onMouseEnter}
									onMouseLeave={this.onMouseLeave}>
										<NavLink
											to={`/learn`}
											onClick={e=>e.stopPropagation()}>
												<span className={(isHome && !isScrollDown) ? "guest-menu" : "guest-menu"}>Learn more</span>
										</NavLink>
									<Card
										className={`learnmoreSubMenu menu ${dropdownOpen && 'visible'}`}
										noBorder
										padding="10px"
										onClick={this.open(false)}>
										<NavLink
											to={`/learn`}
											onClick={this.open(false)}>
											<span className="guest-menu submenu-item">Learn More</span>
										</NavLink>
										<hr></hr>
										<NavLink
											to={`/about`}
											onClick={this.open(false)}>
											<span className="guest-menu submenu-item">About Us</span>
										</NavLink>
									</Card>
								</section>
								<NavLink
									to = {`/`}
									onClick = { e => {
										e.preventDefault();
										e.stopPropagation();
										const win = window.open('https://medium.com/onegivv', '_blank');
										win.focus();
									}}>
										<span className={(isHome && !isScrollDown) ? "guest-menu" : "guest-menu"}>Blog</span>
								</NavLink>
								<Button
									className={`m-r-10 ${(isHome && !isScrollDown) && 'homeHeaderButton'}`}
									padding="4px 12px"
									inverse={!isHome || isScrollDown}
									sameOutline={true}
									label="Login"
									fontSize="14px"
									onClick={e => history.push(`?modal=${signIn}`)}
								/>

								<Button
									className={`m-r-10 ${(isHome && !isScrollDown) && 'homeHeaderButton'}`}
									padding="4px 12px"
									inverse={!isHome || isScrollDown}
									sameOutline={true}
									label="Signup"
									fontSize="14px"
									onClick={e => history.push(`?modal=${signUp}`)}
								/>
							</div>
						</div>
						<div className="show-mobile">
							<div className="wrapper">
								<div className="menu-toggle" onClick={this.toggleSideMenubar}></div>
							</div>
						</div>
					</div>
				} */}

				<div className={`sideMenubar ${showSideMenubar && 'open'}`}>
					<NavLink exact to="/discovery">
						<Button
							className="discoveryLink"
							padding="6px 18px"
							inverse={true}
							label="Discover"
						/>
					</NavLink>
					<SearchBox onMouseDown={this.onClickSearch} />
					{ isAuth && user && (
						<div className="menu-buttons">
							<div className="auth-buttons">
								<NavLink
									to={`/${user._id}/setting`}
									onClick={e => e.stopPropagation()}>
										<div className="iconBody">
											<img alt='settings' className='settings-img' src='/images/ui-icon/sidemenu/settings.svg' />
										</div>
									<p>Settings</p>
								</NavLink>
								<div className="btn-seperator"></div>
								<div className="but-join" onMouseDown={this.logout}>
									<div className="iconBody">
										<img alt='settings' className='logout-img' src='/images/ui-icon/sidemenu/logout.svg' />
									</div>
									<p>Logout</p>
								</div>
							</div>

							<ul className="sidebarMenu">
								{user.role === NONPROFIT &&
									<li>
										<NavLink to={`/${user ? user._id : ''}/dashboard`} className="nav-link">
											<IconButton label="Home" icon="/images/ui-icon/icon-home.svg" size="28px" fontSize="14px" />
										</NavLink>
									</li>
								}
								<li>
									<NavLink to={`/${user._id}`} className="nav-link">
										<IconButton label="My Profile" icon="/images/ui-icon/icon-profile.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<NavLink to={`/${user ? user._id : ''}/news-feed`} className="nav-link">
										<IconButton label="News Feed" icon="/images/ui-icon/icon-news.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								{ 
									<li>
										<NavLink to={`/${user ? user._id : ''}/projects`} className="nav-link">
											<IconButton label="Projects" icon="/images/ui-icon/icon-project.svg" size="28px" fontSize="14px" />
										</NavLink>
									</li>
								}
								{ 
									<li>
										<NavLink to={`/${user ? user._id : ''}/connects/followers`} className="nav-link">
											<IconButton label="Connects" icon="/images/ui-icon/icon-connects.svg" size="28px" fontSize="14px" />
										</NavLink>
									</li>
								}
								<li>
									<NavLink to={`/${user ? user._id : ''}/chats`} className="nav-link">
										<IconButton label="Chats" icon="/images/ui-icon/icon-chat.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<NavLink to="/about" className="nav-link">
										<IconButton label="About Us" icon="/images/ui-icon/icon-one.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<IconButton label="Blog" icon="/images/ui-icon/icon-blog.svg" size="28px" fontSize="14px" onMouseDown={() => {
										const win = window.open('https://medium.com/onegivv', '_blank');
  										win.focus();
									}} />
								</li>
								<li className="nav-link">
									<div className={`icon-button`} onMouseDown={this.onClickHelp}>
										<IconButton label="Help" icon="/images/ui-icon/icon-help.svg" size="28px" fontSize="14px" />
									</div>
								</li>
							</ul>
						</div>
					)}
					{!isAuth && (
						<div className="menu-buttons">
							<div className="auth-buttons">
								<div className="auth-btn" onMouseDown={e => {e.stopPropagation(); history.push(`?modal=${signUp}`)}}>
									SignUp
								</div>
								<div className="btn-seperator"></div>
								<div className="auth-btn" onMouseDown={e => {e.stopPropagation(); history.push(`?modal=${signIn}`)}}>
									LogIn
								</div>
							</div>
							
							<ul className="sidebarMenu">
								<li>
									<NavLink to="/" className="nav-link">
										<IconButton label="Home" icon="/images/ui-icon/icon-home.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<NavLink to={`/nonProfit`} className="nav-link">
										<IconButton label="Nonprofit" icon="/images/ui-icon/sidemenu/menu_nonprofit.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<NavLink to={`/learn`} className="nav-link">
										<IconButton label="Learn More" icon="/images/ui-icon/icon-one.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<NavLink to="/about" className="nav-link">
										<IconButton label="About Us" icon="/images/ui-icon/icon-one.svg" size="28px" fontSize="14px" />
									</NavLink>
								</li>
								<li>
									<IconButton label="Blog" icon="/images/ui-icon/icon-blog.svg" size="28px" fontSize="14px" onMouseDown={() => {
										const win = window.open('https://medium.com/onegivv', '_blank');
  										win.focus();
									}} />
								</li>
								<li className="nav-link">
									<div className={`icon-button`} onMouseDown={this.onClickHelp}>
										<IconButton label="Help" icon="/images/ui-icon/icon-help.svg" size="28px" fontSize="14px" />
									</div>
								</li>
							</ul>
						</div>
					)}
				</div>

				<Card className={`top-menu ${showTopMenu? 'open' : ''}`} padding="0px">
					<div className="content">
						{ isAuth && user && (
							<div className="button-group">
								<div className="but-signin main-font" onMouseDown={() => {
									this.props.history.push(`/${user._id}/setting`)
								}}>
									<div><img alt='settings' className='settings-img' src='/images/ui-icon/sidemenu/settings.svg' /></div>
									Settings
								</div>
								<div className="but-seperator"></div>
								<div className="but-join main-font text-right" onMouseDown={this.logout}>
									<div><img alt='settings' className='logout-img' src='/images/ui-icon/sidemenu/logout.svg' /></div>
									Logout
								</div>
							</div>
						)}
						{ !isAuth && 
							<div className="desktop-view">
								<div className="button-list">
									<IconButton label="Learn More" icon="/images/ui-icon/icon-one.svg" size="29px" fontSize="12px"  onMouseDown={() => {
										this.props.history.push('/learn')
									}} />
									<IconButton className="text-right" label="Blog" icon="/images/ui-icon/icon-blog.svg"
										size="29px" padding="10px 35px 0px 0px" fontSize="12px" onMouseDown={() => {
											const win = window.open('https://medium.com/onegivv', '_blank');
											win.focus();
										}} />
									<IconButton label="Games" icon="/images/ui-icon/icon-game.svg" size="29px"  fontSize="12px" onMouseDown={() => {
										this.props.history.push('/games')
									}} />
									<IconButton className="text-right" label="Contact Us" icon="/images/ui-icon/icon-contact.svg" size="29px"  fontSize="12px"/>
								</div>
							</div>
						}
					</div>
				</Card>
				{ !editPost && openedPost && (
					<Modal padding="0px" className={`postCardModalBody ${openedPost ? 'open' : ''}`} showModal={openedPost} closeModal={this.closePostModal}>
						<PostCard
							{ ...openedPost }
							logedUser = {user}
							onClickLike = {() => this.onClickPostLike(openedPost)}
							onClickShare = {() => this.onClickPostShare(openedPost)}
							comment = {this.onComment}
							onClickSupport={() => this.onClickSupport(openedPost)}
							onClickDeletePost = {(event) => this.onClickShowDeleteModal(event, openedPost._id)}
							onClickEditPost = {(event) => this.onClickEditPost(event, openedPost)}
							onCloseDialog = {this.closePostModal}
						/>
					</Modal>
                )}
			</nav>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	isAuth: state.authentication.isAuth,
	notifications: state.globalReducer.notifications,
	pendingFriends: state.globalReducer.pendingFriends,
	unreadNotify: state.globalReducer.unreadNotify,
	openedPost: state.post.openPost,
	editPost: state.post.editPost,
	notificationShow: false
})

export default withRouter(
	connect(
		mapStateToProps,
		null,
		null,
		{
			pure: false
		}
	)(HeaderMenu)
)
