import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	sendUserSubscribe
} from '../../../../actions/user'
import Modal from '../../../common/Modal'
import Button from '../../../common/Button'

class SubscribeModal extends Component {
	state = {
		subscribeFirstName: '',
		subscribeLastName: '',
		subscribeEmail: ''
	}

	submitForm = e => {
		e.preventDefault()
		let error = false
		if (!this.state.subscribeFirstName) {
			let input = document.querySelector('input[name="subscribeFirstName"]')
			let span = document.querySelector(
				'input[name="subscribeFirstName"] ~ .globalErrorHandler'
			)
			input.style.borderColor = '#ff4f19'
			span.classList.add('notValid')
			setTimeout(() => {
				input.style.borderColor = '#FF4060'
				span.classList.remove('notValid')
			}, 2500)
			error = true
		}

		if (!this.state.subscribeLastName) {
			let input = document.querySelector('input[name="subscribeLastName"]')
			let span = document.querySelector('input[name="subscribeLastName"] ~ .globalErrorHandler')
			input.style.borderColor = '#ff4f19'
			span.classList.add('notValid')
			setTimeout(() => {
				input.style.borderColor = '#FF4060'
				span.classList.remove('notValid')
			}, 2500)
			error = true
		}

		if (!/\S+@\S+\.\S+/.test(this.state.subscribeEmail)) {
			let input = document.querySelector('input[name="subscribeEmail"]')
			let span = document.querySelector('input[name="subscribeEmail"] ~ .globalErrorHandler')
			span.classList.add('notValid')
			input.style.borderColor = '#ff4f19'
			!this.state.subscribeEmail
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
				firstName: this.state.subscribeFirstName,
				lastName: this.state.subscribeLastName,
				email: this.state.subscribeEmail
			}
			this.props.sendUserSubscribe(data)
		}
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	inputNumChange = e => {
		this.setState({ [e.target.name]: +e.target.value })
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userSubscribe.status !== '') {
			if (nextProps.userSubscribe.status === 'error') {
				nextProps.openThankyouModal(nextProps.userSubscribe.message)
			}
			else {
				this.setState({
					subscribeFirstName: '',
					subscribeLastName: '',
					subscribeEmail: ''
				}, () => {
					nextProps.openThankyouModal()
				})
			}
		}
	}

	render() {
		const { subscribeFirstName, subscribeLastName, subscribeEmail } = this.state
		const { showModal, closeModal } = this.props
		return (
			<Modal title="Stay updated" className="subscribeModal" showModal={showModal} closeModal={closeModal} width="350px">
				<form
					autoComplete="off"
					className="wrapperForForm"
					onSubmit={this.submitForm}>
					<div className="AuthModal">
						<div className="SignUp">
							<div className="form-wrapper">
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="subscribeFirstName"
										value={subscribeFirstName}
										onChange={this.inputChange}
									/>
									<span className="placeholder">
										First name
									</span>
									<span className="globalErrorHandler">
										This field can't be blank
									</span>
								</div>
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="subscribeLastName"
										value={subscribeLastName}
										onChange={this.inputChange}
									/>
									<span className="placeholder">
										Last name
									</span>
									<span className="globalErrorHandler">
										This field can't be blank
									</span>
								</div>
								<div className="input-wrapper">
									<input
										type="text"
										className="input-modal-auth"
										name="subscribeEmail"
										value={subscribeEmail}
										onChange={this.inputChange}
									/>
									<span className="placeholder">Email</span>
									<span className="globalErrorHandler">
										Email is not valid
									</span>
								</div>

								<Button label="Request invite" className="closeX select-button" />
							</div>
						</div>
					</div>
				</form>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	userSubscribe: state.user.userSubscribe
})

const mapDispatchToProps = {
	sendUserSubscribe
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SubscribeModal)