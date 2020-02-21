import React, { Component } from 'react'
import InputComp from '../../../pages/setting/input'
import Button from '../../../common/Button'
import { history } from '../../../../store'
import { forgotPassword } from '../../authModals/modalTypes'
import { changePasswordSetting } from '../../../../actions/setting'
import isValid from '../../../../helpers/validate'
import { connect } from 'react-redux'

class changePassword extends Component {
	onChangeEvent = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	submitForm = e => {
		e.preventDefault()

		let inputs = e.target.getElementsByTagName('input')
		let errors = false
		let formData = {}

		for (let i = 0; i < inputs.length; ++i) {
			let valid = isValid(inputs[i].name, inputs[i].value)
			let notValid = document.querySelector(
				`input[name="${inputs[i].name}"] ~ div.errorHandler`
			)
			let inputValid = document.querySelector(
				`input[name="${inputs[i].name}"]`
			)

			if (valid.length !== 0) {
				notValid.innerHTML = valid[0]
				inputValid.style.borderColor = '#FF90B5'
				errors = true
			} else {
				notValid && (notValid.innerHTML = '')
				notValid && (inputValid.style.borderColor = '#ddd')
			}
			if (inputs[i].name === 'confirmPassword') {
				if (
					document.querySelector(
						'input[type="password"][name="newPassword"].settingsInput'
					).value !== inputs[i].value
				) {
					valid.length === 0 &&
						(notValid.innerHTML = "Passwords don't match")
					valid.length === 0 &&
						(inputValid.style.borderColor = '#FF4060')
					valid.length === 0 && (errors = true)
				} else {
					valid.length === 0 && notValid && (notValid.innerHTML = '')
					valid.length === 0 &&
						notValid &&
						(inputValid.style.borderColor = '#1AAAFF')
				}
			}
			formData[inputs[i].name] = inputs[i].value
		}
		if (!errors) {
			this.props.dispatch(
				changePasswordSetting({
					password: formData.oldPassword,
					newPassword: formData.newPassword
				})
			)
			this.setState({
				oldPassword: '',
				newPassword: '',
				confirmPassword: ''
			})
		}
	}

	state = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	}

	render() {
		const { newPassword, oldPassword, confirmPassword } = this.state

		return (
			<form onSubmit={this.submitForm} className="innerTab">
				<InputComp
					title="Old password:"
					isPass={true}
					placeholder="Please enter your old password"
					onChangeEvent={this.onChangeEvent}
					inputName="oldPassword"
					inputValue={oldPassword}
				/>
				<InputComp
					title="New password:"
					isPass={true}
					placeholder="Please enter your new password"
					onChangeEvent={this.onChangeEvent}
					inputName="newPassword"
					inputValue={newPassword}
				/>
				<InputComp
					title="Repeat password:"
					isPass={true}
					placeholder="Please repeat your new password"
					onChangeEvent={this.onChangeEvent}
					inputName="confirmPassword"
					inputValue={confirmPassword}
				/>
				<p className="restorePassword">
					Forgot your password?
					<span
						className="routerlinkForgot"
						onClick={() =>
							history.push(`?modal=${forgotPassword}`)
						}>
						Restore it here
					</span>
				</p>
				<Button
					className="changePasswordButton"
					label="Change password"
					padding="10px 18px"
				/>
			</form>
		)
	}
}

export default connect()(changePassword)
