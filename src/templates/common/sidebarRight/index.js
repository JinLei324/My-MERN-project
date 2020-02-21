import React, { Component } from 'react'
import Button from '../Button'

export default class sidebarRight extends Component {
	state = {
		search: ''
	}

	onChangeInput = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	render() {
		return (
			<aside className="SidebarRight">
				<div className="rightFollowBlock">
					<h3 className="followersHeader">Folowers</h3>
					<div className="divider" />
					<div className="searchInputWrapper">
						<input
							value={this.state.search}
							onChange={this.onChangeInput}
							type="text"
							name="search"
							className="searchFollowers"
						/>
						<span className="placeholder">Search</span>
						<div className="iconForPlaceholder" />
					</div>
					<ul className="followersBlock">
						<li className="singleFollower">
							<div
								className="avatarFollower"
								style={{
									backgroundImage:
										'url(/images/avatars/jane.jpg)'
								}}
							/>
							<div className="infoUserWrapper">
								<div className="userName">Jane Doe</div>
								<div className="userDescription">
									Lorem ipsum dolor sit amet
								</div>
							</div>
						</li>
						<li className="singleFollower">
							<div
								className="avatarFollower"
								style={{
									backgroundImage:
										'url(/images/avatars/john.jpg)'
								}}
							/>
							<div className="infoUserWrapper">
								<div className="userName">John Doe</div>
								<div className="userDescription">
									Sed do eiusmod
								</div>
							</div>
						</li>
						<li className="singleFollower">
							<div
								className="avatarFollower"
								style={{
									backgroundImage:
										'url(/images/avatars/james.jpg)'
								}}
							/>
							<div className="infoUserWrapper">
								<div className="userName">James & Jennifer</div>
								<div className="userDescription">
									Dolor sit amet
								</div>
							</div>
						</li>
					</ul>
					<Button
						className="showMoreFollowers"
						label="More"
						inverse={true}
					/>
				</div>
			</aside>
		)
	}
}
