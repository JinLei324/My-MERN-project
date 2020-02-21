import React, { Component } from 'react'
import InputComp from '../../../pages/setting/input'
import moment from 'moment'
import Button from '../../Button'
import { connect } from 'react-redux'
import CropperModal from '../../notificationModals/cropperModal'
import {
	changeAvatarSetting,
	changeDonorSetting
} from '../../../../actions/setting'
import isValid from '../../../../helpers/validate'
import { toggleNotification } from '../../../../actions/notificationActions'
import Textarea from 'react-textarea-autosize'
import Autocomplete from '../../Autocomplete'

class editDonor extends Component {
	allowedTime = moment()
		.subtract(16, 'year')
		.subtract(1, 'day')
		.format('YYYY-MM-DD')

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
			this.setNewAva()
			this.props.dispatch(
				changeDonorSetting({
					userID: this.props.user._id,
					firstName: formData.firstName,
					lastName: formData.lastName,
					birthday:
						moment(formData.birthday)
							.utc()
							.valueOf() / 1000,
					donorAddress: formData.donorAddress,
					aboutUs: this.state.aboutme,
					role: this.props.user.role
				})
			)
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

	setNewAva = e => {
		e && e.preventDefault()
		if (this.state.avatarAfterFile) {
			this.props.dispatch(
				changeAvatarSetting({ avatar: this.state.avatarAfterFile })
			)
			this.setState({ avatarAfterFile: '' })
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

	inputHelper = key => e => this.setState({ [key]: e.target.value })

	state = {
		firstName: this.props.user.firstName || '',
		lastName: this.props.user.lastName || '',
		avatar: this.props.user.avatar || '',
		avatarBefore: '',
		avatarAfter: '',
		avatarAfterFile: '',
		birthday:
			moment(this.props.user.birthDate * 1000).format('YYYY-MM-DD') ||
			this.allowedTime,
		aboutme: this.props.user.aboutUs || '',
		donorAddress: this.props.user.donorAddress || ''
	}

	render() {
		const {
			firstName,
			lastName,
			avatar,
			avatarAfter,
			avatarBefore,
			// avatarAfterFile,
			birthday,
			aboutme,
			donorAddress
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
						title="First name:"
						placeholder="Please enter your first name"
						onChangeEvent={this.onChangeEvent}
						inputName="firstName"
						inputValue={firstName}
					/>
					<InputComp
						title="Last name:"
						placeholder="Please enter your last name"
						onChangeEvent={this.onChangeEvent}
						inputName="lastName"
						inputValue={lastName}
					/>
					<div className={`input-wrapper`}>
						<h5 className="labelForInput">About me</h5>
						<Textarea
							className="about-me settingsInput"
							name="aboutme"
							value={aboutme}
							style={{ minHeight: 50, maxHeight: 100 }}
							placeholder="Write something about yourself here and why you give! "
							onChange={this.inputHelper('aboutme')}
						/>
						<div className="errorHandler"></div>
					</div>
					<Autocomplete
						update={({ location }) =>
							this.setState({ donorAddress: location.name })
						}
						name="donorAddress"
						placeholder="Hometown"
						inputPlaceholder="Please repeat your hometown"
						address={donorAddress}
						className="autocomplete-settings"
						errorHandler={<div className="errorHandler" />}
					/>
					<div className="input-wrapper-date">
						<span className="input-label">Birth date</span>
						<input
							className="date-input"
							type="date"
							name="birthday"
							max={this.allowedTime}
							value={birthday}
							onChange={this.onChangeEvent}
						/>
					</div>
					<Button
						className="changeMainButton"
						label="Save changes"
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

export default connect(mapStateToProps)(editDonor)
