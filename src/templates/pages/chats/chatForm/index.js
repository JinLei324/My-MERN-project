import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserAvatar from '../../../common/userComponents/userAvatar'
import Label from '../../../common/Label'
import Message from './Message'
import EmojiMartPicker from 'emoji-mart-picker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../common/Button'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import {
	MESSAGE_LOAD_COUNT
} from '../index'

class ChatForm extends Component {
	state = {
		message: ''
	}

	constructor(props) {
		super(props)
		this.originPos = 0
	}


	handleChange = (e) => {
		this.setState({ message: e.target.value })
		this.props.isTypingIn();
	}

	componentWillUpdate() {
		const node = document.querySelector('.chat-body');
		this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight
	}

	componentDidUpdate() {
		const node = document.querySelector('.chat-body');
		if (this.shouldScrollToBottom) {
			node.scrollTop = node.scrollHeight
		}
		if (this.originPos !== 0) {
			node.scrollTop = node.scrollHeight - this.originPos
			this.originPos = 0
		}
	}

	addEmoji = e => {
		let emojiPic = String.fromCodePoint(`0x${e.unified}`)

		let start = this.commentRef.selectionStart,
			end = this.commentRef.selectionEnd;

		this.setState(
			{
				message: this.state.message.substring(0, start) + emojiPic + this.state.message.substring(end)
			},
			() => {
				this.commentRef.focus();
				this.commentRef.selectionStart = this.commentRef.selectionEnd = start + 1
			});
	}

	handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			this.onSendMessage()
		}
	}

	onSendMessage = () => {
		const {message} = this.state;
		this.props.sendMessage(message, this.state.file)
		this.setState({ message: "" });
	}

	loadMore = () => {
		this.props.loadMore && this.props.loadMore()
		const node = document.querySelector('.chat-body');
		this.originPos = node.scrollHeight
	}

	isSameDay(before, now) {
		return this.date_diff_indays(before, now) > 0
	}

	date_diff_indays = (date1, date2) => {
		const dt1 = new Date(date1);
		const dt2 = new Date(date2);
		return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
	}

	render() {
		const { message } = this.state
		const { user, messages, messageMore, chatWithUserIsTyping, otherUser, messageCount, scene, changeScene } = this.props
		return (
			<div className={`chat-form ${scene === "chat" ? "active" : ""}`}>
				{ otherUser &&
					<div className="info-wrapper">
						<img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={changeScene} />
						<NavLink
							to={`/${otherUser && otherUser._id}`}
							onClick={e => e.stopPropagation()}>
							<div className="avatar-wrapper">
								<UserAvatar
									imgUserType={otherUser.role}
									imgUser={otherUser.avatar}
									userId={otherUser._id}
								/>
							</div>
							<Label
								name={otherUser.companyName || otherUser.firstName + " " + otherUser.lastName}
							/>
						</NavLink>
					</div>}
				<div className="chat-body">
					{messages && messages.length > 0 && messageMore && messageCount >= MESSAGE_LOAD_COUNT && <div className="load-more-wrapper">
						<Button padding="5px 16px" label="Load More" inverse onClick={this.loadMore}></Button>
					</div>}
					{
						messages && messages.length > 0 && messages.map((e, i) => {
							return (
								<div key={e.id}>
									{(i === 0 || this.isSameDay(messages[i - 1].createdAt, messages[i].createdAt)) && <div className="day-separate">{moment(e.createdAt).format("dddd, MMMM Do YYYY")}</div>}
									<Message message={e} user={user} selUser={otherUser} />
								</div>
							)
						})
					}
				</div>
				{user && <div className="input-message">
					<div className="typing-indicator">{chatWithUserIsTyping && otherUser.fullName + " is typing"}</div>
					<div className="comment-wrapper">
						{/* <UserAvatar
                            imgUserType={user.role}
                            imgUser={user.avatar}
                            userId={user._id}
                            size={32}
                        /> */}
						<div className="comment-input">
							<input value={message} className="_input" type="text" placeholder="Type your Message" ref={ref => this.commentRef = ref} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
							{/* <button className="comment-button camera-button" onClick={this.openSelectFile}>
                                <FontAwesomeIcon icon="image" />
                            </button> */}
							<input
								type="file"
								ref={this.previewRef}
								onChange={this.changeFile}
								accept="image/*"
								id="projectFileCreate"
							/>
							<EmojiMartPicker set="google" onChange={this.addEmoji} >
								<button className="comment-button emoji-button">
									<FontAwesomeIcon icon="smile-wink" />
								</button>
							</EmojiMartPicker>
						</div>
						<img className="btn-send" src="/images/ui-icon/icon-send.svg" alt="" onClick={this.onSendMessage} />
					</div>
				</div>}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	userId: state.authentication.userId
})


export default connect(
	mapStateToProps,
	null
)(ChatForm)