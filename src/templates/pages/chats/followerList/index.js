import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChatUser from '../../../common/chat/ChatUser';

class FollowerList extends Component {

	state = {
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		const { followerList, onPopupClose, onClickMessageIcon } = this.props;
		
		return (
			<div className="follower-user-body">
				<div className='header'>
					<div className='closeBtn' onClick={onPopupClose}></div>
				</div>
				{ followerList.length !== 0 && followerList.map((e, i) => {
					return (
						<ChatUser key={e._id} border={followerList.length - 1 !== i}
							user={e} last_msg={e.last_message ? e.last_message.content : ''}
							last_time={e.last_message ? e.last_message.createdAt : ''} status={e.presence === 1 ? 'online' : 'offline'}
							un_read_count={e.unreadMsgCount} onClickMessageIcon={() => { onClickMessageIcon(e); }
						} />
					)
				}) }
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	userId: state.authentication.userId
})

const mapDispatchToProps = {
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FollowerList)