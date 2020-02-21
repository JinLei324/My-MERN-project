import React from 'react'
import { connect } from 'react-redux'
import LayoutNotificationModal from './layoutNotificationModal'
import { resendMail } from '../../../actions/notificationActions'
import Button from '../Button'

const NotificationModal = ({
	close,
	firstTitle,
	secondTitle,
	buttonText,
	resend,
	dispatch
}) => {
	let email = document.querySelector('input[name="email"].input-modal-auth')
	email && (email = email.value)
	return (
		<div className="NotificationModal">
			{firstTitle && <h1>{firstTitle}</h1>}
			{secondTitle && <h4>{secondTitle}</h4>}
			<Button onClick={close} label={buttonText} />
			{resend && (
				<p>
					Can't find the letter?
					<button onClick={() => dispatch(resendMail(email))}>
						Resend
					</button>
				</p>
			)}
		</div>
	)
}

export default connect()(LayoutNotificationModal(NotificationModal))
