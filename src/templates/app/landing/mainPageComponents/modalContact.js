import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sendUserContact} from '../../../../actions/user';

class ContactModal extends Component {

	state = {
		contactFirstName: '',
		contactLastName: '',
		contactEmail: '',
		contactMessage: ''
	}

	submitForm = e => {
		e.preventDefault();

		let error = false;
		if (!this.state.contactFirstName) {
			let input = document.querySelector('input[name="contactFirstName"]');
			let span = document.querySelector(
				'input[name="contactFirstName"] ~ .error'
			);
			input.style.borderColor = '#ff4f19'
			span.classList.add('notValid')
			setTimeout(() => {
				input.style.borderColor = '#FF4060'
				span.classList.remove('notValid')
			}, 2500)
			error = true;
		}

		if (!this.state.contactLastName) {
			let input = document.querySelector('input[name="contactLastName"]')
			let span = document.querySelector('input[name="contactLastName"] ~ .error')
			input.style.borderColor = '#ff4f19'
			span.classList.add('notValid')
			setTimeout(() => {
				input.style.borderColor = '#FF4060'
				span.classList.remove('notValid')
			}, 2500)
			error = true
		}

		if (!/\S+@\S+\.\S+/.test(this.state.contactEmail)) {
			let input = document.querySelector('input[name="contactEmail"]')
			let span = document.querySelector('input[name="contactEmail"] ~ .error')
			span.classList.add('notValid')
			input.style.borderColor = '#ff4f19'
			!this.state.contactEmail
				? (span.innerHTML = 'Please, enter your email')
				: (span.innerHTML = 'Email is not valid')
			setTimeout(() => {
				input.style.borderColor = '#FF4060'
				span.classList.remove('notValid')
			}, 2500)
			error = true
		}
		if (!error) {
			let data = {
				firstName: this.state.contactFirstName,
				lastName: this.state.contactLastName,
				email: this.state.contactEmail,
				message: this.state.contactMessage
			}
			this.props.sendUserContact(data)
		}
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userContact.status !== '') {
			if (nextProps.userContact.status !== 'error') {
				this.setState({
					contactFirstName: '',
					contactLastName: '',
					contactEmail: '',
					contactMessage: ''
				}, () => {
					nextProps.openThankyouContactModal()
				})
			}
		}
	}

	render() {
		const { contactFirstName, contactLastName, contactEmail, contactMessage } = this.state
		const { showContactModal, closeContactModal } = this.props
		return (
			<div
				className={`LayoutModal${showContactModal ? ' open' : ''}`}
				onClick={closeContactModal}>
				<form
					autoComplete="off"
					className="wrapperForForm"
					onSubmit={this.submitForm}>
					<div className="AuthModal">
						<div className="SignUp">
							<div className="modalHeader">
								<h2>Contact Us</h2>
								<div
									className="closeBtn"
									onClick={closeContactModal}
								/>
							</div>
							<div className="form-wrapper">
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="contactFirstName"
										value={contactFirstName}
										onChange={this.inputChange}
									/>
									<span className="placeholder">
										First name
									</span>
									<span className="error">
										This field can't be blank
									</span>
								</div>
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="contactLastName"
										value={contactLastName}
										onChange={this.inputChange}
									/>
									<span className="placeholder">
										Last name
									</span>
									<span className="error">
										This field can't be blank
									</span>
								</div>
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="contactEmail"
										value={contactEmail}
										onChange={this.inputChange}
									/>
									<span className="placeholder">Email</span>
									<span className="error">
										Email is not valid
									</span>
								</div>
								<div className="input-wrapper">
									<textarea
										className="input-modal-auth"
										name="contactMessage"
										onChange={this.inputChange}
										value={contactMessage}
									></textarea>
									<span className="placeholder">Message</span>
									<span className="error">
										Message is not valid
									</span>
								</div>
								<input
									type="submit"
									className="select-button"
									value="Send"
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	userContact: state.user.userContact
})

const mapDispatchToProps = {
	sendUserContact
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactModal)