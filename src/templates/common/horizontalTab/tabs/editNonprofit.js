import React, { Component } from 'react'
import InputComp from '../../../pages/setting/input'
import Button from '../../../common/Button'
import Autocomplete from '../../Autocomplete'
import { connect } from 'react-redux'
import CropperModal from '../../../common/notificationModals/cropperModal'
import {
	changeAvatarSetting,
	changeNonprofitSetting
} from '../../../../actions/setting'
import isValid from '../../../../helpers/validate'
import { toggleNotification } from '../../../../actions/notificationActions'

class editNonprofit extends Component {
	onChangeEvent = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	onAddressChange = e => {
		let address = { ...this.state.address, [e.target.name]: e.target.value }
		this.setState({ address })
	}

	submitForm = e => {
		e.preventDefault()

		let inputs = e.target.getElementsByTagName('input')
		let errors = false
		let addressFields = ["address1", "address2", "city", "state", "country", "zipcode"]
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

			if (addressFields.indexOf(inputs[i].name) > -1) {
				if (!formData.address) formData.address = {}
				formData.address[inputs[i].name] = inputs[i].value
			}
			
			formData[inputs[i].name] = inputs[i].value
		}
		if (!errors) {
			this.setNewAva()
			this.props.dispatch(
				changeNonprofitSetting({
					userID: this.props.user._id,
					ein: formData.ein,
					billingAddress: formData.billingAddress,
					address: formData.address,
					companyName: formData.companyName,
					role: this.props.user.role
				})
			)
		}
	}

	setNewAva = e => {
		e && e.preventDefault()
		if (this.state.avatarAfterFile) {
			this.props.dispatch(
				changeAvatarSetting({ avatar: this.state.avatarAfterFile })
			)
			this.setState({ avatarAfterFile: '' })
		}
	}

	handleNewImage = e => {
		if(e.target.files.length === 0)
			return;
		if (
			e.target.files[0].type !== 'image/jpeg' &&
			e.target.files[0].type !== 'image/png'
		) {
			this.props.dispatch(
				toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				})
			)
		} else {
			if (e.target.files[0].size / 1024 / 1024 <= 10) {
				this.setState({ avatarBefore: e.target.files[0] })
			} else {
				document.getElementById('newAvatarField').value = ''
				this.props.dispatch(
					toggleNotification({
						isOpen: true,
						resend: false,
						firstTitle: 'Error',
						secondTitle: 'Your avatar should be up to 10 mb',
						buttonText: 'Ok'
					})
				)
			}
		}
	}

	focusInputFile = e => {
		e.preventDefault()
		this.inputElement.click()
	}

	closeCropper = (avatarAfter, avatarAfterFile) => {
		this.setState({ avatarBefore: '', avatarAfter, avatarAfterFile })
		document.getElementById('newAvatarField').value = ''
	}

	state = {
		companyName: this.props.user.companyName || '',
		address: this.props.user.address || {
			address1: '',
			address2: '',
			city: '',
			country: '',
			state: '',
			zipcode: ''
		},
		billingAddress: this.props.user.billingAddress || '',
		ein: this.props.user.ein || '',
		avatar: this.props.user.avatar || '',
		avatarBefore: '',
		avatarAfter: '',
		avatarAfterFile: ''
	}

	render() {
		const {
			companyName,
			address,
			billingAddress,
			ein,
			avatar,
			avatarAfter,
			avatarBefore
			// avatarAfterFile
		} = this.state

		return (
			<div className="innerTab">
				{avatarBefore && (
					<CropperModal
						imageUrl={avatarBefore}
						closeCropper={this.closeCropper}
					/>
				)}
				<form
					onSubmit={this.setNewAva}
					className="input-wrapper-avatar">
					<input
						type="file"
						className="input-modal-auth-avatar"
						name="newAvatarField"
						onChange={this.handleNewImage}
						id="newAvatarField"
					/>
					<label
						ref={input => (this.inputElement = input)}
						style={
							avatarAfter
								? {
										backgroundImage: `url(${avatarAfter})`,
										backgroundSize: 'cover'
								  }
								: avatar
									? {
											backgroundImage:
												'url(' + avatar + ')',
											backgroundSize: 'cover'
									  }
									: {}
						}
						htmlFor="newAvatarField">
						<div className="icon-placeholder" />
					</label>
					<Button
						onClick={this.focusInputFile}
						className="changeAvaProfileButton"
						label="Change avatar"
						padding="10px 18px"
					/>
				</form>
				<form className="input-form" onSubmit={this.submitForm}>
					<InputComp
						title="Company name"
						placeholder="Please enter your company name"
						onChangeEvent={this.onChangeEvent}
						inputName="companyName"
						inputValue={companyName}
					/>
					<InputComp
						title="Address1"
						placeholder="Address1"
						onChangeEvent={this.onAddressChange}
						inputName="address1"
						inputValue={address.address1}
						className="width-50"
					/>
					<InputComp
						title="Address2"
						placeholder="Address2"
						onChangeEvent={this.onAddressChange}
						inputName="address2"
						inputValue={address.address2}
						className="width-50"
					/>
					<InputComp
						title="City"
						placeholder="City"
						onChangeEvent={this.onAddressChange}
						inputName="city"
						inputValue={address.city}
						className="width-50"
					/>
					<InputComp
						title="State"
						placeholder="State"
						onChangeEvent={this.onAddressChange}
						inputName="state"
						inputValue={address.state}
						className="width-50"
					/>
					<InputComp
						title="Country"
						placeholder="Country"
						onChangeEvent={this.onAddressChange}
						inputName="country"
						inputValue={address.country}
						className="width-50"
					/>
					<InputComp
						title="Zipcode"
						placeholder="Zipcode"
						onChangeEvent={this.onAddressChange}
						inputName="zipcode"
						inputValue={address.zipcode}
						className="width-50"
					/>
					<Autocomplete
						update={({ location }) =>
							this.setState({ billingAddress: location.name })
						}
						name="billingAddress"
						placeholder="Billing address"
						inputPlaceholder="Please repeat your billing address"
						address={billingAddress}
						className="autocomplete-settings"
						errorHandler={<div className="errorHandler" />}
					/>
					<InputComp
						title="EIN:"
						placeholder="Please repeat your EIN"
						onChangeEvent={this.onChangeEvent}
						inputName="ein"
						inputValue={ein}
					/>
					<Button
						label="Save changes"
						className="changeMainButton"
						padding="10px 18px"
					/>
				</form>
			</div>
		)
	}
}

const mapStateToProps = ({ authentication }) => ({
	user: authentication.user
})

export default connect(mapStateToProps)(editNonprofit)
