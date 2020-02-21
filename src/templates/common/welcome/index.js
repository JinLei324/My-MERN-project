import React from 'react'
import Modal from '../Modal'
import Button from '../Button'
import { NONPROFIT, DONOR, STUDENT } from '../../../helpers/userRoles'

const Welcome = ({ user, showModal, closeModal }) => {
	return (
		<Modal className="welcome" width="450px" padding="30px" showModal={showModal}>
			<div className="welcome-component">
				{user && user.role === NONPROFIT && <h2 className="welcome-title">Welcome to OneGivv, {user.companyName}!</h2>}
				{user && (user.role === DONOR || user.role === STUDENT) && <h2 className="welcome-title">Welcome to OneGivv, {`${user.firstName} ${user.lastName}`}!</h2>}
				<div className="separator-20"></div>
				<img src="/images/ui-icon/welcome.svg" alt="welcome" />
				<div className="separator-20"></div>
				{user && user.role === NONPROFIT && <p className="welcome-description">Welcome to <b>OneGivv</b>! Now that you’re all signed up, it’s time to explore all that our platform has to offer! Create volunteer opportunities, donations projects, and post donation item needs. Update, share stories, and more. Click on "Discover" to get started!</p>}
				{user && (user.role === DONOR || user.role === STUDENT) && <p className="welcome-description">Welcome to <b>OneGivv</b>! Now that you’re all signed up, it’s time to explore all that our platform has to offer! Interested in volunteering, donating, or checking out new nonprofits? Click on "Discover" to get started!</p>}
				<div className="separator-10"></div>
				<Button solid label="Discover" padding="8px 32px" onClick={() => closeModal()} />
			</div>
		</Modal>
	)
}

export default Welcome