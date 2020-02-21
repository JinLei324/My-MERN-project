import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Hints } from 'intro.js-react';
import { Helmet } from 'react-helmet'

import { history } from '../../../store';

import { getUserProfile } from '../../../actions/followsAction';

import Button from '../../common/Button';
import UserAvatar from '../../common/userComponents/userAvatar';
import { checkHint } from '../../../helpers/websocket';

import { inviteChannels } from '../../../consts/inviteChannels';

import InviteUI from './InviteUI';
import Followers from './followers';
import Following from './following';

class Connects extends Component {

	state = {
		isOther: false,
		user: {},
		showHints: true,
		basicHints: [
			{
				id: 10,
				element: '.hint-connect',
				hint: 'Follow friends, family, and fellow philanthropists through our connect feature!',
				hintPosition: 'middle-right'
			}
		],
		hints: [
		],
		isShowInviteUI: false
	}

	componentDidMount() {
		// document.querySelector('html').scrollTop = 0;
		
		this._mounted = true;
		this.props.dispatch(getUserProfile(this.props.match.params.id));
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	static getDerivedStateFromProps(props, state) {
		const currUsId = props.match.params.id;
		const myID = props.user && props.user._id;
		state.isOther = currUsId !== myID;
		if (state.isOther) {
			state.user = props.otherUser;
		} else {
			state.user = props.user;
			state.hints = state.basicHints.filter(e => {
				if (!state.user.hints.includes(e.id)) {
					return e;
				}
				return false;
			})
		}
		return state;
	}

	onCloseHint = idx => {
		if (!this._mounted)
			return;

		const { hints } = this.state;
		const hId = hints[idx].id;
		checkHint(hId);
	}

	onClickInviteFriends = () => {
		this.setState({
			isShowInviteUI: true
		});
		// window.inviteFriendsViaGetSocial();
	}

	onCloseInviteUI = () => {
		this.setState({
			isShowInviteUI: false
		});
	}

	onClickInviteChannel = (channel) => {
		this.setState({
			isShowInviteUI: false
		});
		window.inviteFriendsViaGetSocial(channel);
	}

	onClickBack = () => {
		history.goBack();
	}

	render() {
		const { user, hints, showHints, isShowInviteUI } = this.state;
		const { isAuth } = this.props;

		return (
			<div className="ConnectsPage">
				<Helmet>
					<script src="https://websdk.getsocial.im/sdk.min.js"></script>
				</Helmet>
				<img className='btn-go-back' src='/images/ui-icon/arrow-left.svg' alt='btn-back' onClick={this.onClickBack} />
				{ user && isAuth && 
					<Button className="hint-invite-friends" label="Invite Friends" padding="10px 20px" onClick={this.onClickInviteFriends}>
					</Button> }
				{ user && isAuth && isShowInviteUI && 
					<InviteUI inviteChannels={inviteChannels} showModal={isShowInviteUI} closeModal={this.onCloseInviteUI} clickInviteChannel={this.onClickInviteChannel} />
				}
				{ user && (
					<div className="hint-connect topSection">
						<Hints
							enabled={showHints}
							hints={hints}
							onClose={this.onCloseHint}
							ref={hints => this.hintRef = hints}
						/>
						<div className="wrapper">
							<NavLink to={`/${user._id}`} className="userHolder">
								<UserAvatar
									imgUser={user.avatar}
									imgUserType={user.role}
								/>
								<p className="userName">
									{user.companyName
										? user.companyName
										: user.firstName + ' ' + user.lastName}
								</p>
							</NavLink>
							<div className="navTabHolder">
								<NavLink
									to={`/${user._id}/connects/followers`}
									className="tabClicker">
									Followers
								</NavLink>
								<NavLink
									to={`/${user._id}/connects/following`}
									className="tabClicker">
									Following
								</NavLink>
							</div>
						</div>
					</div>
				)}
				{user && (
					<div className="userSection">
						<Switch>
							<Route
								exact
								path="/:id/connects/followers"
								component={Followers}
							/>
							<Route
								exact
								path="/:id/connects/following"
								component={Following}
							/>
						</Switch>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = ({ authentication, follows }) => ({
	user: authentication.user,
	isAuth: authentication.isAuth,
	otherUser: follows.userInfo
})

export default connect(
	mapStateToProps,
	null,
	null,
	{
		pure: false
	}
)(Connects)