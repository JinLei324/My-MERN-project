import React, { Component } from 'react'
import Moment from 'moment';

class NotificationPanel extends Component {
	state={
		// Sample data
		notifications: [
			{time: Moment.utc().format('h mm'), message: "Reply to Debie Wilhelm"},
			{time: Moment.utc().format('h mm'), message: "New invitation from Julie", type: "invite"},
			{time: Moment.utc().format('h mm'), message: "Wireframes with Josh"},
			{time: Moment.utc().format('h mm'), message: "Follow up on Wireframes and Design"}
		]
	}

	render() {
		let {
			notifications
		} = this.state

		return (
			<div className="notificationPanel">
				<div className="panel-header">
					<div className="badge-wrapper">
						<img src="/images/ui-icon/notification.svg" alt="" />
						<span className="badge">3</span>
					</div>
					<div className="text-block">
						<h4>Notification</h4>
						<p>{ Moment.utc().format('d MMMM') }</p>
					</div>
				</div>
				<div className="panel-body">
					{notifications.map((e, i) => (
						<div className="notification" key={i}>
							<div className="progressBar"></div>
							<span className="time">{ e.time }</span>
							<p className="message">{ e.message }</p>
							{e.type && e.type === 'invite' &&
								<div className="invite-block">
									<div className="accept-invite">
										<span>Accept</span>
									</div>
									<span className="view-event">View Event</span>
								</div>
							}
							<div className="separator-15" />
						</div>
					))}
				</div>
			</div>
		)
	}
}

export default NotificationPanel