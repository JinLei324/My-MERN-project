import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { NONPROFIT } from '../../../helpers/userRoles'
// import NotificationBadge from 'react-notification-badge';
import {
	getChatList
} from '../../../actions/chat';

class SidebarLeft extends Component {
	state = {
		chatList: []
		// showCampaignsSubmenu: false,
		// campaignName: ""
	};

	_ismounted = true;

	componentDidMount() {
		this._ismounted = true

		// Here ya go
		this.setActiveCampaign(this.props.history.location.pathname)
		this.props.history.listen((location, action) => {
			if (!this._ismounted)
				return
			this.setState({ showCampaignsSubmenu: false })
			this.setActiveCampaign(location.pathname)
		});

		this.props.getChatList({
			skip: 0,
			limit: 1000000,
			search: ""
		});
	}

	componentWillUnmount() {
		this._ismounted = false
	}

	setActiveCampaign = (path) => {
		if (path.includes('campaigns')) {
			let paths = path.split('/')
			this.setState({ campaignName: paths[paths.length - 1] })
		}
		else {
			this.setState({ campaignName: "" })
		}
	}

	changeActiveToFollows = (match, location) => {
		if (!location) {
			return false
		} else {
			let myId = this.props.user && this.props.user._id
			let currentUserId = this.props.history.location.pathname

			const { pathname } = location
			let result =
				/\/connects\/following/gi.test(pathname) ||
				/\/connects\/followers/gi.test(pathname)
			return !!(currentUserId.indexOf(myId) + 1) && result
		}
	}

	changeActiveProjects = (match, location) => {
		if (!location) {
			return false
		} else {
			let myId = this.props.user && this.props.user._id
			let currentUserId = this.props.history.location.pathname

			const { pathname } = location
			let result = /\/projects$/gi.test(pathname)
			return !!(currentUserId.indexOf(myId) + 1) && result
		}
	}

	toggleCampaignsSubmenu = e => {
		e.preventDefault()
		this.setState(prevState => ({
			showCampaignsSubmenu: !prevState.showCampaignsSubmenu
		}));
	}

	render() {
		// const { showCampaignsSubmenu, campaignName } = this.state
		const { user } = this.props;

		// let unreadMsgCount = 0;
		// this.props.userList.forEach(e => {
		// 	unreadMsgCount += e.unreadMsgCount;
		// });

		return (
			<aside className="SidebarLeft">
				<ul className="leftMenu">
					{user && user.role === NONPROFIT && <li><NavLink
						exact
						className="dashboardMainLink"
						to={`/${user._id}/dashboard`}>
						<span className="showDesktop">Home</span>
					</NavLink></li>}
					<li><NavLink
						exact
						className="myProfileMainLink"
						to={`/${user ? user._id : ''}/`}>
						<span className="showDesktop">My profile</span>
					</NavLink></li>
					<li><NavLink
						className="newsFeedMainLink"
						to={`/${user ? user._id : ''}/news-feed`}>
						<span className="showDesktop">News feed</span>
					</NavLink></li>
					{/* {user && user.role !== NONPROFIT && <li><NavLink
						className="gameMainLink"
						to={`/games`}>
						<span className="showDesktop">Games</span>
					</NavLink></li>} */}
					{user && <li><NavLink
						className="projectsMainLink"
						isActive={this.changeActiveProjects}
						to={`/${user ? user._id : ''}/projects`}>
						<span className="showDesktop">Projects</span>
					</NavLink></li>}
					{/*user && user.role === NONPROFIT && 
					<li>
						<NavLink
							className={`campaignsMainLink ${campaignName}`}
							to={`/${user ? user._id : ''}/campaigns`}
							onClick={this.toggleCampaignsSubmenu}>
							<span className="showDesktop">Campaigns</span>
						</NavLink>
						<div className={`submenu ${showCampaignsSubmenu ? 'open' : ''}`}>
							<NavLink
								className="campaignsDonationMainLink"
								to={`/${user ? user._id : ''}/campaigns/donations`}>
								<span>Donations</span>
							</NavLink>
							<NavLink
								className="campaignsVolunteerMainLink"
								to={`/${user ? user._id : ''}/campaigns/volunteer`}>
								<span>Volunteer</span>
							</NavLink>
							<NavLink
								className="campaignsPickupMainLink"
								to={`/${user ? user._id : ''}/campaigns/pickup`}>
								<span>Pickup</span>
							</NavLink>
						</div>
					</li>*/}
					{user && <li><NavLink
						className="connectsMainLink"
						isActive={this.changeActiveToFollows}
						to={`/${user ? user._id : ''}/connects/followers`}>
						<span className="showDesktop">Connects</span>
					</NavLink></li> }
					{/* {user && user.role === NONPROFIT && <li><NavLink
						className="connectsMainLink"
						to={`/${user ? user._id : ''}/contacts`}>
						<span className="showDesktop">Contacts</span>
					</NavLink></li>} */}
					<li>
						{/* <NotificationBadge count={unreadMsgCount} effect={[null, null, {top:'-5px'}, {top:'-5px'}]} style={{fontSize: '15px', padding: '3px 5px', width: '10px', height: '13px',  borderRadius: '50%', top: '-5px', left: '7px', bottom: '', right: ''}} /> */}
						<NavLink
							className="chatsMainLink"
							to={`/${user ? user._id : ''}/chats`}>
							<span className="showDesktop">Chats</span>
						</NavLink>
					</li>
				</ul>
			</aside>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	userList: state.chat.chatList
})

const mapDispatchToProps = {
	getChatList
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
		null,
		{
			pure: false
		}
	)(SidebarLeft)
)
