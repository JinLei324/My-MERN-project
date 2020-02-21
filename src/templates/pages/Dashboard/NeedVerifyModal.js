import React, { Component } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

class NeedVerifyModal extends Component {

	closeModal = (e) => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.props.closeModal()
		}
	}

	render() {
		return (
			<Modal title="Before you're able to create projects, verify your organization" showModal={this.props.showModal} closeModal={this.closeModal}>
				<div className="separator-25" />
				<div className="center">
					<Button
						label="Okay"
						padding="8px 16px"
						onClick={() => this.props.closeModal()}
					/>
				</div>
			</Modal>
		)
	}
}

export default NeedVerifyModal