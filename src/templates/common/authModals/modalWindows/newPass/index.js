import React, { Component } from 'react'
import HeaderModal from '../../components/headerModal'
import { newPassword, signIn } from '../../modalTypes'
import Button from '../../../Button'

class NewPassword extends Component {
	state = {
		password: '',
		passwordConfirmation: ''
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	render() {
		const { handleClose, changeTypeId } = this.props
		const { password, passwordConfirmation } = this.state

		return (
			<div className="NewPassword">
				<HeaderModal
					title="Change password"
					handleClose={handleClose}
				/>
				<div className="form-wrapper">
					<div className="input-wrapper">
						<input
							type="password"
							className="input-modal-auth"
							name="password"
							autoComplete="disable-autofill"
							maxLength="50"
							value={password}
							onChange={this.inputChange}
						/>
						<span className="placeholder">New password</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper">
						<input
							type="password"
							className="input-modal-auth"
							name="passwordConfirmation"
							autoComplete="disable-autofill"
							maxLength="50"
							value={passwordConfirmation}
							onChange={this.inputChange}
						/>
						<span className="placeholder">
							Password confirmation
						</span>
						<span className="globalErrorHandler" />
					</div>
					<input type="hidden" name="formType" value={newPassword} />
					<Button
						className="select-button"
						label="Change password"
						padding="13px 25px"
					/>
					<div className="change-route-in-modal">
						<span className="text-to-type">
							Just remembered your previous password?
						</span>
						<span
							onClick={() => changeTypeId(signIn)}
							className="link-to-type">
							Sign In
						</span>
					</div>
				</div>
			</div>
		)
	}
}

export default NewPassword
