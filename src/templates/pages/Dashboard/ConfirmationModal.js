import React, { Component } from 'react'
import Modal from '../../common/Modal'
import Button from '../../common/Button'

class ConfirmationModal extends Component {

	closeModal = (e) => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.props.closeModal()
		}
	}

	render() {
		return(
			<Modal title="Confirmation!" showModal={this.props.showModal} closeModal={this.closeModal}>
				<div className="confirmationModal">
					<div className="text-center main-font m-0">You can't reject once you accept it.</div>
					<div className="separator-25" />
					<div className="button-group">
						<Button
							label="Okay"
							padding="6px 18px"
							onClick={() => this.props.acceptRequest()}
						/>
						<Button
							className="closeBtn"
							label="Cancel"
							inverse
							padding="6px 18px"
							onClick={this.closeModal}
						/>
					</div>
				</div>
			</Modal>
		)
	}
}

export default ConfirmationModal