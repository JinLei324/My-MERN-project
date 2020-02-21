import React, { Component } from 'react'
import Modal from '../../../common/Modal'
import Button from '../../../common/Button'

class ModalThankyou extends Component {
	render() {
		const { showModal, closeModal, error } = this.props

		return (
			<Modal showModal={showModal} closeModal={closeModal} width="350px" className="thankyouModal">
				<div className={`wrapper${error ? 'subscribe-error' : ''}`}>
					{error && (
						<h1>
							{error ===
							'Duplicate resource or resource already exists'
								? 'Your email is already in our invite list'
								: error}
						</h1>
					)}
					{!error && (
						<h1>
							Thank you
							<br />
							for requesting the invite!
						</h1>
					)}
					{!error && <p>We will contact you soon!</p>}
					<div className="separator-30" />
					<Button label="OK" padding="8px 40px" fontSize="18px" className="closeX" onClick={closeModal} />
				</div>
			</Modal>
		)
	}
}

export default ModalThankyou