import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatList from './chatList';
import ChatForm from './chatForm';
import queryString from 'query-string';
import {
	getChatList,
	getChatHistory,
	addChatItem
} from '../../../actions/chat';
import { NONPROFIT, DONOR } from '../../../helpers/userRoles';
import { sendMessage, receiveMessage, listenUserPresenceChanged } from '../../../helpers/websocket';
import { getUserFollowers, clearListFollow } from '../../../actions/followsAction';

export const MESSAGE_LOAD_COUNT = 15

class Chats extends Component {

	state = {
		chatList: [],
		previousList: [],
		selectedUser: {},
		selectedUserId: null,
		followerList: [],
		previousFollowerList: [],
		selectedFollower: {},
		selectedFollowerId: null,
		chatWithUserIsTyping: false,
		curScene: "list",
		chatListChanged: false,
		chatListType: "chat",
	}

	constructor(props) {
		super(props)
		this.userContactList = []
		this.userFollowerList = []
		this.isMount = false;
	}
	
	componentDidMount() {
		this.isMount = true
		if (this.props.userId) {
			const params = queryString.parse(this.props.history.location.search);
			this.setState({selectedUserId: params.other, curScene: "list"})
			this.props.getChatList({
				skip: 0,
				limit: 1000000,
				search: ""
			})
		}

		receiveMessage(data => {
			this.onReceiveMessage(data)
		});
		listenUserPresenceChanged(data => {
			this.presenceChanged(data)
		});
	}

	componentWillUnmount() {
		this.isMount = false
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.previousList !== nextProps.userList) {
			this.setState({ previousList: nextProps.userList }, () => {
				this.loadedUserList(nextProps.userList);
			});			
		}
		if (this.state.previousFollowerList !== nextProps.followerList) {
			this.setState({previousFollowerList: nextProps.followerList}, () => {
				this.loadedFollowerList(nextProps.followerList);
			});			
		}
	}

	loadedUserList(contactArray) {
		this.userContactList = []
		contactArray.forEach(e => {
			const idx = this.userContactList.findIndex(i => i._id === e._id)
			if (idx === -1) {
				e.canLoad = false
				e.fullName = e.companyName ? e.companyName : e.firstName + " " + e.lastName
				this.userContactList.push(e)
			}
		});

		this.userContactList = this.sortUser(this.userContactList);
		const array = this.userContactList.filter(user => user.last_message !== null);
		const selIdx = this.userContactList.findIndex(i => i._id === this.state.selectedUserId);
		let selectedUser = null; let selectedUserId = null;
		if (selIdx === -1) {
			if (this.userContactList.length > 0) {
				selectedUser = this.userContactList[0];
				selectedUserId = selectedUser._id.toString();	
			}
		} else {
			selectedUser = this.userContactList[selIdx];
			selectedUserId = selectedUser._id.toString();
		}

		this.setState({
			chatList: array, selectedUser: selectedUser, selectedUserId: selectedUserId
		}, () => {
			this.getChatHistory('all');
		})
	}

	loadedFollowerList(followerArray) {
		this.userFollowerList = []
		followerArray.forEach(e => {
			const idx = this.userFollowerList.findIndex(i => i._id === e._id)
			if (idx === -1) {
				e.canLoad = false
				e.fullName = e.companyName ? e.companyName : e.firstName + " " + e.lastName
				this.userFollowerList.push(e)
			}
		})

		const selIdx = this.userFollowerList.findIndex(i => i._id === this.state.selectedFollowerId)
		let selectedFollower = null;
		if (selIdx === -1) {
			if (this.userFollowerList.length > 0)
			selectedFollower = this.userFollowerList[0]
		} else {
			selectedFollower = this.userFollowerList[selIdx]
		}
		
		const array = this.userFollowerList.filter(user => user.last_message !== null)
		this.setState( { followerList: array, selectedFollower: selectedFollower }, () => {
		})
	}

	getUserList({search, skip, limit}) {
		let array;
		if (search !== '') {
			array = this.userContactList.filter(user => user.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
		} else {
			array = this.userContactList.filter(user => user.last_message !== null)
		}
		array = array.filter(user => user.last_message !== null)
		
		this.setState({ chatList: array });
	}

	getFollowerList({search, skip, limit}) {
		let array;
		if (search !== '') {
			array = this.userFollowerList.filter(user => user.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
		} else {
			array = this.userFollowerList.filter(user => user.last_message !== null)
		}
		
		this.setState( { followerList: array } );
	}

	onClickUser = chatWith => {
		this.setState({ selectedUser: chatWith, selectedUserId: chatWith._id, curScene: "chat" }, () => {
			// this.getChatHistory({ otherId: chatWith });
			this.getChatHistory('one-to-one');
		});		
	}

	onClickFollower = chatWith => {
		this.setState({ selectedFollower: chatWith, curScene: "chat" }, () => {
		});		
	}

	onClickNew = () => {
		const { chatListType } = this.state;
		const { userId } = this.props;

		if (chatListType === 'chat') {
			this.setState({ chatListType: 'follower' }, () => {
				this.props.getUserFollowers(userId, {
					skip: null
				});
			})
		}
	}

	onPopupClose = () => {
		this.setState({ chatListType: 'chat' }, () => {
			this.props.clearListFollow('followers');
		});
	}

	onReceiveMessage = data => {
		var { chatList, selectedUser, selectedUserId, chatListChanged } = this.state
		const { userId } = this.props;
		var otherId = null
		if (data.sender === userId) {
			otherId = data.receiver
		} else if (data.receiver === userId) {
			otherId = data.sender
		}
		if (otherId) {
			const idx = chatList.findIndex(i => i._id === otherId)
			if (idx !== -1) {
				chatList[idx].last_message = data;
				if (otherId !== selectedUserId) {
					chatList[idx].unreadMsgCount++;
				}
				chatList = this.sortUser(chatList)
				this.setState({chatList, chatListChanged: !chatListChanged});
			}
		}
		if ((data.sender === userId && data.receiver === selectedUser._id) || (data.receiver === userId && data.sender === selectedUser._id)) {
			this.props.addChatItem(data)
		}
	}

	sendMessage = (message, file) => {
		if (message.trim() === '') {
			return;
		}
		const {user} = this.props
		const {selectedUser} = this.state
		if (selectedUser.isFollower || (selectedUser.isFollowing && selectedUser.role === NONPROFIT) || user.role === DONOR || (selectedUser.last_message !== null)) {
			const data = {
				receiver: selectedUser._id,
				content: message
			}
			sendMessage(data)
		}
	};

	sortUser = users => {
		users = users.slice().sort((x, y) => {
            return y.presence > x.presence ? 1 : -1;
		});

		return users.slice().sort((x, y) => {
			if (y.last_message === null) {
				if (x.last_message === null) {
					return 1;
				} else 
					return -1;
			} else {
				if (x.last_message === null) {
					return 1;
				}
				return y.last_message.createdAt > x.last_message.createdAt ? 1 : -1;
			}
			
		});
	};
	
	onUserTypes = user => {
	};
	
    onUserNotTypes = user => {
    };

    presenceChanged = data => {	
		let { chatList, chatListChanged } = this.state
		const idx = chatList.findIndex(i => i._id === data.userId)
		if (idx !== -1) {
			chatList[idx].presence = data.presence;
			this.setState({chatList, chatListChanged: !chatListChanged});
		}
    }
	
	isTypingIn = () => {
	} 

	changeToList = () => {
		this.setState({curScene: "list"})
	}

	getChatHistory = type => {
		const { selectedUser } = this.state
		
		if (selectedUser) {
			this.props.getChatHistory({ otherId: selectedUser._id, type: type });
		}
	}

	render() {
		const { chatList, selectedUser, selectedFollower, followerList, chatWithUserIsTyping, curScene, chatListType, chatListChanged } = this.state;
		const canLoad = false;
		const messageCount = 0;
		const { chatHistory } = this.props;

		return (
			<div className="ChatsPage">
				<ChatList 
					chatList={ chatList } selectedUser={selectedUser}
					getUserList={({search, skip, limit}) => this.getUserList({search, skip, limit})}
					followerList={ followerList } selectedFollower={selectedFollower}
					getFollowerList={({search, skip, limit}) => this.getFollowerList({search, skip, limit})} 
					scene={curScene} changed={chatListChanged} chatListType={chatListType}
					onClickUser={this.onClickUser}
					onClickNew={this.onClickNew} onPopupClose={this.onPopupClose} onClickMessageIcon={this.onClickUser} />
				<ChatForm messages={chatHistory} 
					otherUser={selectedUser}
					sendMessage = {this.sendMessage} messageMore={canLoad} loadMore={this.loadPreviousMessages} messageCount ={messageCount}
					isTypingIn={this.isTypingIn}
					chatWithUserIsTyping ={chatWithUserIsTyping} scene={curScene} changeScene={this.changeToList}/>
			</div>
		)
	}
}

const mapStateToProps = state => ({	
	userId: state.authentication.userId,
	user: state.authentication.user,
	userList: state.chat.chatList,
	chatHistory: state.chat.chatHistory,
	followerList: state.follows.followers
})

const mapDispatchToProps = {
	getChatList,
	getChatHistory,
	addChatItem,
	getUserFollowers,
	clearListFollow
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Chats)
