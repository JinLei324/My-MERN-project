import React, { Component } from 'react'
import HeaderModal from '../../components/headerModal'
import { forgotPassword } from '../../modalTypes'
import Button from '../../../Button'

class ForgotPassword extends Component {
	state = {
		newEmail: ''
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value })
	}

	render() {
		const { handleClose } = this.props
		const { newEmail } = this.state

		return (
			<div className="ForgotPassword">
				<HeaderModal
					title="Forgot password?"
					handleClose={handleClose}
				/>
				<div className="form-wrapper">
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							name="newEmail"
							maxLength="50"
							value={newEmail}
							autoComplete="disable-autofill"
							onChange={this.inputChange}
						/>
						<span className="placeholder">Your email</span>
						<span className="globalErrorHandler" />
					</div>
					<input
						type="hidden"
						name="formType"
						value={forgotPassword}
					/>
					<Button
						className="select-button"
						label="Reset password"
						padding="13px 25px"
					/>
				</div>
			</div>
		)
	}
}

export default ForgotPassword
