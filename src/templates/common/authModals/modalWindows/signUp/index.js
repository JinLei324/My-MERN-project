import React, { Component } from 'react';

import HeaderModal from '../../components/headerModal'
import { signIn, signUp } from '../../modalTypes'
import Button from '../../../Button'
import { STUDENT, NONPROFIT, DONOR } from '../../../../../helpers/userRoles'

class SignUp extends Component {

	state = {
		email: '',
		password: '',
		passwordConfirmation: '',
		userType: DONOR,
		isChecked: false
	}

	componentDidMount() {
	}

	inputChange = e => {
		this.setState({
			[e.target.name]:
				e.target.name === 'userType' ? +e.target.value : e.target.value
		});

		if (e.target.name === 'password' || e.target.name === 'passwordConfirmation') {
			
		}
	}

	toggleCheckboxChange = () => {
		this.setState({isChecked: !this.state.isChecked})
	}

	render() {
		const { handleClose, changeTypeId } = this.props
		const { email, password, passwordConfirmation, userType, isChecked } = this.state
		let user_agreement = ""
		if (userType === NONPROFIT) {
			user_agreement = "https://s3.amazonaws.com/onegivv-common/User+Agreement+(Tax-Exempt+Organizations)+-+OneGivv.pdf"
		} else {
			user_agreement = "https://s3.amazonaws.com/onegivv-common/User+Agreement+(Donors)+-+OneGivv.pdf"
		}
		return (
			<div className="SignUp">
				<HeaderModal
					title="Join the Beta"
					handleClose={handleClose}
				/>
				<h5 className="smallHeader">Сhoose your role</h5>
				<div className="form-wrapper">
					<div className="chooseUserTypes">
						<input
							type="radio"
							name="userType"
							id="userTypeStudent"
							className={`chooseAccountType ${
								userType === STUDENT ? 'checked' : ''
							}`}
							value={STUDENT}
							onChange={this.inputChange}
							checked={userType === STUDENT}
						/>
						<label htmlFor="userTypeStudent">Student</label>
						<input
							type="radio"
							name="userType"
							id="userTypeDonor"
							className={`chooseAccountType ${
								userType === DONOR ? 'checked' : ''
							}`}
							value={DONOR}
							onChange={this.inputChange}
							checked={userType === DONOR}
		
						/>				<label htmlFor="userTypeDonor">Donor</label>
						<input
							type="radio"
							name="userType"
							id="userTypeNonprofit"
							className={`chooseAccountType ${
								userType === NONPROFIT ? 'checked' : ''
							}`}
							value={NONPROFIT}
							onChange={this.inputChange}
							checked={userType === NONPROFIT}
						/>
						<label htmlFor="userTypeNonprofit">Nonprofit</label>
					</div>
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							autoComplete="disable-autofill"
							name="email"
							maxLength="50"
							value={email}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Email</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper">
						<input
							type="password"
							autoComplete="disable-autofill"
							maxLength="50"
							minLength="6"
							className="input-modal-auth"
							name="password"
							value={password}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Password</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper">
						<input
							type="password"
							autoComplete="disable-autofill"
							className="input-modal-auth"
							name="passwordConfirmation"
							maxLength="50"
							minLength="6"
							value={passwordConfirmation}
							onChange={this.inputChange}
						/>
						<span className="placeholder">
							Password confirmation
						</span>
						<span className="globalErrorHandler" />
					</div>
					<label className="checkbox-container">
						<div>
							<span>I have read, understand, and agree to the terms of the <a href={user_agreement} target="_blank" rel="noopener noreferrer">User Agreement</a> and <a href="https://s3.amazonaws.com/onegivv-common/Privacy+Policy+(OneGivv).pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a> as a condition to my use of or benefit from the Website or the Services provided by OneGivv.</span>
						</div>
						<input
							type="checkbox"
							name="isChecked"
							checked={isChecked}
							onChange={this.toggleCheckboxChange}
						/>
						<span className="checkmark"></span>
					</label>
					<input type="hidden" name="formType" value={signUp} />
					<Button
						className="select-button"
						label="Continue"
						padding="13px 25px"
						disabled={!isChecked}
					/>
					<div className="change-route-in-modal">
						<span className="text-to-type">
							Already have an account?
						</span>
						<span
							onClick={() => changeTypeId(signIn)}
							className="link-to-type">
							Sign in
						</span>
					</div>
				</div>
			</div>
		)
	}
}

export default SignUp
