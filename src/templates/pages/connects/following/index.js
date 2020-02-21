import React, { Component } from 'react'
import UserAvatar from '../../../common/userComponents/userAvatar'
import { NavLink } from 'react-router-dom'
import {
	getUserFollowings,
	unfollowThisUser,
	followThisUser,
	clearListFollow
} from '../../../../actions/followsAction'
import { connect } from 'react-redux'
import Button from '../../../common/Button'
import Placeholder from '../../../common/noContentPlaceholder'
import { history } from '../../../../store'
import { signIn } from '../../../../templates/common/authModals/modalTypes'

class Following extends Component {
	state = {
		currentPage: 1
	}

	componentDidMount() {
		document.addEventListener('scroll', this.scrollUpload, false)
		this.props.dispatch(
			getUserFollowings(this.props.match.params.id, {
				skip: this.props.users.length
			})
		)
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.scrollUpload, false)
		this.props.dispatch(clearListFollow('followings'))
	}

	scrollUpload = () => {
		let body = document.querySelector('html'),
			counts = document.querySelectorAll('ul.listOfUsers li.singleUser')
				.length,
			scroll = body.clientHeight + body.scrollTop === body.scrollHeight,
			perPage = this.state.currentPage,
			elemsOnPage = perPage * 10 <= counts && counts <= (perPage + 1) * 10

		if (scroll && elemsOnPage) {
			this.setState({ currentPage: this.state.currentPage + 1 })
			this.props.dispatch(
				getUserFollowings(this.props.match.params.id, {
					skip: this.props.users.length
				})
			)
		}
	}

	unfollowUser = userId => {
		this.props.dispatch(unfollowThisUser(userId))
	}

	followUser = userId => {
		this.props.dispatch(followThisUser(userId))
	}

	render() {
		const { users, myUser, isAuth, otherUser, userId } = this.props

		return (
			<ul className="listOfUsers">
				{!users && <div>Matching</div>}
				{users &&
					users.length === 0 && (
						<Placeholder
							titileButton={'Button'}
							onClickAction={false}
							titleMain={`${(myUser &&
								userId === otherUser._id &&
								'You do not follow anyone') ||
								(otherUser &&
									(otherUser.companyName
										? otherUser.companyName
										: otherUser.firstName +
										  ' ' +
										  otherUser.lastName) +
										' does not follow anyone')}`}
						/>
					)}
				{users &&
					users.map((user, i) => (
						<li className="singleUser" key={i}>
							<NavLink
								to={`/${user && user._id}`}
								className="userDataWrapper">
								<div className="avatarWrapper">
									<UserAvatar
										size={60}
										imgUser={user.avatar}
										imgUserType={user.role}
									/>
								</div>
								<div className="userTextWrapper">
									<p className="userName">
										{user &&
											(user.companyName
												? user.companyName
												: user.firstName +
												  ' ' +
												  user.lastName)}
									</p>
									{user &&
										isAuth &&
										user.isFollower && (
											<p className="userFollow">
												Following you
											</p>
										)}
									{myUser &&
										user &&
										myUser._id === user._id && (
											<p className="userFollow">
												This is you
											</p>
										)}
								</div>
							</NavLink>
							{user &&
								myUser &&
								user.isFollowing &&
								myUser._id !== user._id && (
									<Button
										onClick={() =>
											this.unfollowUser(user._id)
										}
										className="followUserButton"
										inverse={true}
										label="Unfollow"
									/>
								)}
							{user &&
								myUser &&
								!user.isFollowing &&
								myUser._id !== user._id && (
									<Button
										onClick={() =>
											this.followUser(user._id)
										}
										className="followUserButton"
										label="Follow"
									/>
								)}
							{!myUser && (
								<Button
									onClick={() => history.push(`?modal=${signIn}`)}
									className="followUserButton"
									label="Follow"
								/>
							)}
						</li>
					))}
			</ul>
		)
	}
}

const mapStateToProps = ({ follows, authentication }) => ({
	userId: authentication.userId,
	users: follows.followings,
	myUser: authentication.user,
	otherUser: follows.userInfo,
	isAuth: authentication.isAuth
})

export default connect(
	mapStateToProps,
	null
)(Following)
