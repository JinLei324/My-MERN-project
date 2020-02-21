import React, { Component } from 'react';

import { history } from '../../../../store';

export default class UserAvatar extends Component {

	constructor(props) {
		super(props);

		let avatar = '/images/ui-icon/avatar_placeholder.svg';
		if (this.props.imgUser) {
			avatar = this.props.imgUser;
		}

		let size = this.props.size || 60;

		this.state = {
			size: size / 2.5,
			style: {
				width:
					(this.props.selfAvatar ? 20 : 0) + (this.props.size || 60),
				height: size
			},
			wrapperStyle: {
				minHeight: size,
				minWidth: size,
				width: size,
				height: size
			},
			avatar
		}
	}

	onSelectUser = e => {
		history.push(`/${this.props.userId}`);
	}

	static getDerivedStateFromProps(props) {
		let avatar = '/images/ui-icon/avatar_placeholder.svg'
		if (props.imgUser) {
			avatar = props.imgUser
		}
		let status = ''
		switch (props.status) {
			case true:
				status = 'online'
				break
			case false:
				status = 'offline'
				break
			default:
				break
		}
		return { status, avatar }
	}

	render() {
		const { imgUserType, selfAvatar, isSharer, isSelf } = this.props;
		const { style, size, status, avatar, wrapperStyle } = this.state;

		return (
			<div className={`UserAvatar ${isSharer ? 'sharer' : ''} ${isSelf ? 'self' : ''}`} style={style} onClick={this.onSelectUser}>
				{ selfAvatar && (
					<img src={selfAvatar} className="self-avatar" alt="" />
				)}
				<span className={`avatar-wrapper ${isSharer ? 'sharer' : ''}`} style={wrapperStyle}>
					<img src={avatar} className="avatar" alt="" />
				</span>
				{ imgUserType !== 0 && imgUserType && !isSharer && <span
					className="typeWrapper"
					style={{
						width: size,
						height: size
					}}>
					<span className={`iconType userType${imgUserType}`}>
						{typeof imgUserType !== 'number' ? '?' : ''}
					</span>
				</span>}
				<span className={`point ${status}`} />
			</div>
		)
	}
}
