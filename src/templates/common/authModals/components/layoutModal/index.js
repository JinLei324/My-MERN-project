import React from 'react'
import {
	login,
	register,
	createUser,
	forgotPasswordAction,
	passwordResetModal
} from '../../../../../actions/authActions'

import {
	forgotPassword,
	newPassword,
	signIn,
	signUp,
	newNonprofit,
	newStudent,
	newDonor
} from '../../modalTypes'
import queryString from 'query-string'
import isValid from '../../../../../helpers/validate'
import moment from 'moment'

const LayoutModal = WrappedComponent => {
	
	return props => {
		
		let submitForm = e => {
			e.preventDefault()

			let inputs = e.target.getElementsByTagName('input')
			let errors = false
			let addressFields = ["address1", "address2", "city", "state", "country", "zipcode"]
			let formData = {}

			for (let i = 0; i < inputs.length; ++i) {
				let valid = isValid(inputs[i].name, inputs[i].value)
				let notValid = document.querySelector(
					`input[name="${inputs[i].name}"] ~ span.globalErrorHandler`
				)				
				let inputValid = document.querySelector(
					`input[name="${inputs[i].name}"]`
				)

				if (valid.length !== 0) {
					notValid && (notValid.innerHTML = valid[0])
					inputValid.style.borderColor = '#FF4060'
					errors = true
				} else {
					notValid && (notValid.innerHTML = '')
					notValid && (inputValid.style.borderColor = '#1AAAFF')
				}

				if (addressFields.indexOf(inputs[i].name) > -1) {
					if (!formData.address) formData.address = {}
					formData.address[inputs[i].name] = inputs[i].value
				}

				if (inputs[i].name === 'passwordConfirmation') {
					if (
						document.querySelector(
							'input[type="password"].input-modal-auth'
						).value !== inputs[i].value
					) {
						valid.length === 0 &&
							(notValid.innerHTML = "Passwords don't match")
						valid.length === 0 &&
							(inputValid.style.borderColor = '#FF4060')
						valid.length === 0 && (errors = true)
					} else {
						valid.length === 0 &&
							notValid &&
							(notValid.innerHTML = '')
						valid.length === 0 &&
							notValid &&
							(inputValid.style.borderColor = '#1AAAFF')
					}
				}
				if (inputs[i].name) {
					if (
						(inputs[i].name === 'userType' && inputs[i].checked) ||
						(inputs[i].name === 'gender' && inputs[i].checked) ||
						(inputs[i].name !== 'userType' &&
							inputs[i].name !== 'gender')
					) {
						formData[inputs[i].name] = inputs[i].value
					}
					if (inputs[i].name === 'interests') {
						formData['interests'] = inputs[i].value.split(",")
					}
				}
			}
			
			if (!errors) {
				switch (+formData.formType) {
					case forgotPassword:
						props.dispatch(
							forgotPasswordAction({ email: formData.newEmail })
						)
						break
					case newPassword:
						const params = queryString.parse(props.location.search)
						props.dispatch(
							passwordResetModal({
								password: formData.password,
								hash: params.token || ''
							})
						)
						break
					case signIn:
						props.dispatch(
							login({
								email: formData.email,
								password: formData.password
							})
						)
						break
					case signUp:
						props.dispatch(
							register({
								email: formData.email,
								password: formData.password,
								role: +formData.userType
							})
						)
						break
					case newNonprofit:
						props.dispatch(
							createUser({
								companyName: formData.company,
								address: formData.address,
								billingAddress: formData.billing,
								ein: formData.ein
							})
						)
						break
					case newStudent:
						const birthDateStudent =
							moment(formData.birthday)
								.utc()
								.valueOf() / 1000

						const { _id } = props.schools.find(
							el => el.name === formData.school
						)
						props.dispatch(
							createUser({
								birthDate: birthDateStudent,
								firstName: formData.firstName,
								gender: formData.gender.toLowerCase(),
								lastName: formData.lastName,
								donorAddress: formData.donorAddress,
								interests: formData.interests,
								school: _id,
								isPrivate: formData.privacy
							})
						)
						break
					case newDonor:
						const birthDateDonor =
							moment(formData.birthday)
								.utc()
								.valueOf() / 1000

						props.dispatch(
							createUser({
								birthDate: birthDateDonor,
								firstName: formData.firstName,
								gender: formData.gender.toLowerCase(),
								lastName: formData.lastName,
								donorAddress: formData.donorAddress,
								interests: formData.interests,
								isPrivate: formData.privacy
							})
						)
						break
					default:
						break
				}
			}
		}

		return (
			<div
				className={`LayoutModal${props.showModal ? ' open' : ''}`}
				onClick={props.handleClose}>
				<form
					autoComplete="off"
					className="wrapperForForm"
					onSubmit={submitForm}>
					<WrappedComponent {...props} />
				</form>
			</div>
		)
	}
}

export default LayoutModal
