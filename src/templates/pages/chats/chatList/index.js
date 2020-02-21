import React, { Component } from 'react'
import { connect } from 'react-redux';

import ChatUser from '../../../common/chat/ChatUser';
import FollowerList from '../followerList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../common/Button';
import { Hints } from 'intro.js-react';
import { checkHint } from '../../../../helpers/websocket';
import { NONPROFIT } from '../../../../helpers/userRoles';

class ChatList extends Component {

	state = {
		text: "",
		showHints: true,
		basicHints: [
			{
				id: 11,
				element: '.hint-chat',
				hint: 'Chat with friends, family, and reach out to nonprofits about any questions you may have or just to say Hello! Chat allows you to privately reach out to anyone on this platform.',
				hintPosition: 'bottom-right'
			},
		],
		hints: [
		]
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.chatListType !== this.props.chatListType) {
			this.setState({
				text: ''
			});
		}
	}

	componentDidMount() {
		this._mounted = true
		if (this.props.user) {
			if (this.props.user.role === NONPROFIT) {
				let basicHints = this.state.basicHints
				basicHints[0].hint = "Chat with donors, other nonprofits, and businesses who support your cause! Chat allows you to privately reach out to anyone on the OneGivv platform."
			}
			let hints = this.state.basicHints.filter(e => {
				if (!this.props.user.hints.includes(e.id)) {
					return e
				}
				return false
			})
			this.setState({ hints });
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	handleChange = (e) => {
		this.setState({ text: e.target.value }, () => {
			const { chatListType } = this.props;
			if (chatListType === 'chat') {
				this.props.getUserList({
					search: this.state.text,
					skip: 0,
					limit: 10
				})
			} else if (chatListType === 'follower') {
				this.props.getFollowerList({
					search: this.state.text,
					skip: 0,
					limit: 10
				})
			}
		})
	}

	onCloseHint = idx => {
		if (!this._mounted)
			return;
		const { hints } = this.state
		const hId = hints[idx].id
		checkHint(hId)
	}

	render() {
		const {
			text,
			hints,
			showHints } = this.state
		const { onClickUser, onClickNew, chatList, selectedUser, scene, chatListType, followerList, onPopupClose, onClickMessageIcon } = this.props

		return (
			<div className={`contact-chat ${scene === "list" ? "active" : ""}`}>
				<Hints
					enabled={showHints}
					hints={hints}
					onClose={this.onCloseHint}
					ref={hints => this.hintRef = hints}
				/>
				<div className="contact-chat-header">
					<div className="main-font _title">Chats</div>
				</div>
				<div className="search-body">
					<div className="hint-chat search-wrapper">
						<div className="search-bar">
							<FontAwesomeIcon className="_icon" icon="search" />
							<input className="_text" type="text" placeholder="Search" value={text} onChange={this.handleChange}  />
							<Button padding="7px 20px" solid noBorder label="New" onClick={ () => { onClickNew(); } } />
						</div>
					</div>
					<div className="chat-user-body">
						{ chatListType === 'chat' && chatList.length !== 0 && chatList.map((e, i) => {
							return (
								<ChatUser key={e._id} className={`${selectedUser._id === e._id ? 'active' : ''}`} border={chatList.length - 1 !== i}
									user={e} last_msg={e.last_message ? e.last_message.content : ''}
									last_time={e.last_message ? e.last_message.createdAt : ''} status={e.presence === 1 ? 'online' : 'offline'}
									un_read_count={e.unreadMsgCount} onClickMessageIcon={null}
									onClick={() => { onClickUser(e); }
									} />
							)
						}) }
						{ chatListType === 'follower' && 
							<FollowerList followerList={ followerList } onPopupClose = { onPopupClose } onClickMessageIcon = {onClickMessageIcon} /> }
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	user: state.authentication.user,
	userId: state.authentication.userId,
	totCount: state.chat.totCount
})

const mapDispatchToProps = {

}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatList)