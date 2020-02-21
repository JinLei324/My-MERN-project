import React, { Component } from 'react'
import InputComp from '../../../pages/setting/input'
import Button from '../../../common/Button'
import { changeEmailSetting } from '../../../../actions/setting'
import { connect } from 'react-redux'
import isValid from '../../../../helpers/validate'

class changeEmail extends Component {
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
			formData[inputs[i].name] = inputs[i].value
		}
		if (!errors) {
			this.props.dispatch(
				changeEmailSetting({
					email: formData.newEmail,
					password: formData.currentPassword
				})
			)
			this.setState({
				currentPassword: '',
				newEmail: ''
			})
		}
	}

	state = {
		currentPassword: '',
		newEmail: ''
	}

	render() {
		const { newEmail, currentPassword } = this.state
		return (
			<form onSubmit={this.submitForm} className="innerTab">
				<InputComp
					title="New email:"
					placeholder="Please enter your new email"
					onChangeEvent={this.onChangeEvent}
					inputName="newEmail"
					inputValue={newEmail}
				/>
				<InputComp
					title="Password:"
					isPass={true}
					placeholder="Please enter your password"
					onChangeEvent={this.onChangeEvent}
					inputName="currentPassword"
					inputValue={currentPassword}
				/>
				<Button
					className="changeEmailButton"
					label="Change email"
					padding="10px 18px"
				/>
			</form>
		)
	}
}

export default connect()(changeEmail)
