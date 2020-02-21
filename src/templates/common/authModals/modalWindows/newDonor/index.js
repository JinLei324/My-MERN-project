import React, { Component } from 'react'
import Select, { components } from 'react-select'
import moment from 'moment'
import HeaderModal from '../../components/headerModal'
import ToggleButton from 'react-toggle-button'
import CropperModal from '../../../notificationModals/cropperModal'
import { setUpAvatarToStore } from '../../../../../actions/authActions'
import { newDonor } from '../../modalTypes'
import { connect } from 'react-redux'
import Button from '../../../Button'
import { toggleNotification } from '../../../../../actions/notificationActions'
import {
	getAllInterests
} from '../../../../../actions/global'

const selectStyles = {
	control : styles => ({...styles, borderRadius: 16}),
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	placeholder: styles => ({ ...styles, color: '#ccc' }),
	option: (styles, state) => (
		{ ...styles,
			position: "relative",
			padding: `5px 5px 5px 30px`,
			backgroundColor: 'transparent',
			color: state.isSelected ? '#1AAAFF' : '#666666',
			':active': {
				backgroundColor: 'transparent'
			},
			'::before': {
				content: '""',
				background: 'url(/images/ui-icon/check.svg)',
				backgroundRepeat: "no-repeat",
				backgroundSize: "10px 7px",
				display: state.isSelected ? "block" : "none",
				width: "10px",
				height: "7px",
				position: "absolute",
				top: "10px",
				left: "10px"
			}
		}
	),
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/dropdown.svg" alt="" />
			</components.DropdownIndicator>
		)
	);
};
class NewDonor extends Component {
	allowedTime = moment()
		.subtract(16, 'year')
		.subtract(1, 'day')
		.format('YYYY-MM-DD')

	state = {
		school: '',
		avatarBefore: '',
		avatarAfter: '',
		gender: 'Male',
		firstName: '',
		lastName: '',
		birthday: this.allowedTime,
		allInterests: [],
		selected_interests: [],
		interests_string: "",
		isPrivate: false
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	togglePrivacy = isPrivate => e => {
		this.setState({
			isPrivate: isPrivate
		})
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
				document.getElementById('chooseAvatar').value = ''
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

	closeCropper = (avatarAfter, avatarAfterFile) => {
		this.props.dispatch(setUpAvatarToStore(avatarAfterFile))
		this.setState({ avatarBefore: '', avatarAfter })
		document.getElementById('chooseAvatar').value = ''
	}

	componentDidMount() {
		this.props.dispatch(getAllInterests())
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.all_interests) {
			const allInterests = nextProps.all_interests.map(e => {
				return { value: e._id, label: e.title }
			})

			this.setState({allInterests})
		}
	}

	onSelectInterest = target => {
		const interests_string = target.map(inter => {
			return inter.value
		})
		this.setState({ selected_interests: target, interests_string: interests_string })
	}

	render() {
		const { handleClose } = this.props
		const {
			birthday,
			avatarBefore,
			avatarAfter,
			gender,
			firstName,
			lastName,
			allInterests,
			selected_interests,
			interests_string,
			isPrivate
		} = this.state

		let privateStyle = {
			trackStyle: {
				width: 32,
				height: 16,
				opacity: !isPrivate ? '.3' : '',
				background: isPrivate
					? 'linear-gradient(90deg, #1AAAFF 0%, #5EEDFD 100%)'
					: ''
			},
			thumbStyle: {
				width: 14,
				height: 14,
				boxShadow: 'none'
			}
		}


		return (
			<div className="NewDonor">
				<HeaderModal
					title="Create donor account"
					handleClose={handleClose}
				/>
				<div className="form-wrapper">
					{avatarBefore && (
						<CropperModal
							imageUrl={avatarBefore}
							closeCropper={this.closeCropper}
						/>
					)}
					<div className="input-wrapper-avatar">
						<input
							type="file"
							className="input-modal-auth-avatar"
							name="avatar"
							id="chooseAvatar"
							onChange={this.handleNewImage}
						/>
						<label
							htmlFor="chooseAvatar"
							style={
								avatarAfter
									? {
											backgroundImage: `url(${avatarAfter})`,
											backgroundSize: 'cover'
									  }
									: {}
							}>
							<span className="placeholder-avatar">
								{`${
									avatarAfter ? 'Change avatar' : 'Add avatar'
								}`}
							</span>
							<div className="icon-placeholder" />
						</label>
					</div>
					<div className="chooseGenderBlock">
						<input
							type="radio"
							name="gender"
							id="genderMale"
							className={`chooseGender ${
								gender === 'Male' ? 'checked' : ''
							}`}
							value="Male"
							onChange={this.inputChange}
							checked={gender === 'Male'}
						/>
						<label htmlFor="genderMale">Male</label>
						<input
							type="radio"
							name="gender"
							id="genderFemale"
							className={`chooseGender ${
								gender === 'Female' ? 'checked' : ''
							}`}
							value="Female"
							onChange={this.inputChange}
							checked={gender === 'Female'}
						/>
						<label htmlFor="genderFemale">Female</label>
						<input
							type="radio"
							name="gender"
							id="genderOther"
							className={`chooseGender ${
								gender === 'Other' ? 'checked' : ''
							}`}
							value="Other"
							onChange={this.inputChange}
							checked={gender === 'Other'}
						/>
						<label htmlFor="genderOther">Other</label>
					</div>
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							name="firstName"
							autoComplete="disable-autofill"
							maxLength="50"
							value={firstName}
							onChange={this.inputChange}
						/>
						<span className="placeholder">First name</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							autoComplete="disable-autofill"
							name="lastName"
							maxLength="50"
							value={lastName}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Last name</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper interest-sel">
						<div className="control-label">Select Interests</div>
						<Select
							className="select-interest"
							value={selected_interests}
							onChange={this.onSelectInterest}
							options={allInterests}
							isMulti
							isSearchable
							placeholder="Select your category"
							controlShouldRenderValue={true}
							closeMenuOnSelect={false}
							hideSelectedOptions={false}
							isClearable={false}
							menuContainerStyle={{zIndex: 200}}
							styles={selectStyles}
							components={{ DropdownIndicator }}
							menuPlacement="auto"
						/>
						<input className="interest_input" name="interests" value={interests_string} onChange={this.inputChange} />
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper-date">
						<span className="input-label">Birth date</span>
						<input
							className="date-input"
							type="date"
							name="birthday"
							max={this.allowedTime}
							value={birthday}
							onChange={this.inputChange}
						/>
					</div>
					<section className="privacy-toggle">
						<h3 className="secondTitle marginNotification">
							Privacy
						</h3>
						<div className="pushNotification">
							<h4>Privacy</h4>
							<ToggleButton								
								inactiveLabel={false}
								trackStyle={privateStyle.trackStyle}
								thumbStyle={privateStyle.thumbStyle}
								thumbAnimateRange={[1, 15]}
								activeLabel={false}
								value={isPrivate}
								onToggle={this.togglePrivacy(!isPrivate)}
							/>
						</div>
						<input name="privacy" type="hidden" value={isPrivate} />
						<div className="set_description">When privacy settings are enabled, only followers you've accepted can access or view your profile and posts! Other users will request to follow you and you must accept their request before they are allowed to view your profile, post, or be able to message you.</div>
					</section>
					<input type="hidden" name="formType" value={newDonor} />
					<Button
						className="select-button without-bottom-link"
						label="Apply"
						padding="13px 25px"
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ globalReducer }) => ({
	schools: globalReducer.schools,
	all_interests: globalReducer.interests,
})

export default connect(mapStateToProps)(NewDonor)
