import React, { Component } from 'react'
import HeaderModal from '../../components/headerModal'
import { forgotPassword, signUp, signIn } from '../../modalTypes'
import Button from '../../../Button'

class SignIn extends Component {

	state = {
		email: '',
		password: ''
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		const { handleClose, changeTypeId, failedCount } = this.props;
		const { email, password } = this.state;

		return (
			<div className="SignIn">
				<HeaderModal title="Sign In" handleClose={handleClose} />
				<div className="form-wrapper">
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							name="email"
							maxLength="50"
							autoComplete="disable-autofill"
							value={email}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Email</span>
						<span className="globalErrorHandler" />
					</div>
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
						<span className="placeholder">Password</span>
						<span className={`globalErrorHandler passwordError ${failedCount < 5 ? 'show' : 'hide'}`}>
							<span>Password attempts remaining: {failedCount}</span>
						</span>
					</div>
					<div className="change-route-in-modal second-in-page">
						<div
							onClick={() => changeTypeId(forgotPassword)}
							className="link-to-type">
							Forgot password?
						</div>
					</div>
					<input type="hidden" name="formType" value={signIn} />
					<Button
						className="select-button"
						label="Continue"
						padding="13px 25px"
					/>
					<div className="change-route-in-modal">
						<span className="text-to-type">
							Don't have an account?
						</span>
						<span
							onClick={() => changeTypeId(signUp)}
							className="link-to-type">
							Sign up
						</span>
					</div>
				</div>
			</div>
		)
	}
}

export default SignIn
