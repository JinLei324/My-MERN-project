import React, { Component } from 'react'
import HeaderModal from '../../components/headerModal'
import CropperModal from '../../../notificationModals/cropperModal'
import { newNonprofit } from '../../modalTypes'
import { setUpAvatarToStore } from '../../../../../actions/authActions'
import { connect } from 'react-redux'
import Button from '../../../Button'
import { toggleNotification } from '../../../../../actions/notificationActions'
import Autocomplete from '../../../Autocomplete'

class NewNonprofit extends Component {

	state = {
		avatarBefore: '',
		avatarAfter: '',
		company: '',
		billing: '',
		ein: ''
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	setLocationBilling = ({ location }) => {
		this.setState({ billing: location.name })
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

	checkLocalStorage = () => {
		if (localStorage.getItem('verificationForUser') !== null) {
			let userData = JSON.parse(localStorage.getItem('verificationForUser'))
			this.setState(Object.assign({}, this.state, userData))
		}
	}

	componentDidMount () {
		this.checkLocalStorage()
	}

	render() {
		const { handleClose } = this.props
		const {
			avatarBefore,
			avatarAfter,
			company,
			billing,
			ein
		} = this.state

		return (
			<div className="NewNonprofit">
				<HeaderModal
					title="Create nonprofit account"
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
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							autoComplete="disable-autofill"
							name="company"
							maxLength="50"
							value={company}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Company</span>
						<span className="globalErrorHandler" />
					</div>
					<Autocomplete
						update={this.setLocationBilling}
						placeholder="Billing address"
						name="billing"
						className="autocomplete-modal-window"
						address={billing}
						errorHandler={<span className="globalErrorHandler" />}
					/>
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							name="ein"
							maxLength="50"
							autoComplete="disable-autofill"
							value={ein}
							onChange={this.inputChange}
						/>
						<span className="placeholder">EIN</span>
						<span className="globalErrorHandler" />
					</div>
					<input type="hidden" name="formType" value={newNonprofit} />
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

export default connect()(NewNonprofit)
