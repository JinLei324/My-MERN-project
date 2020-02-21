import React, { Component } from 'react'
import { connect } from 'react-redux'
import { history } from '../../../store'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement,
	StripeProvider,
	injectStripe,
	Elements,
} from 'react-stripe-elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../common/Card'

import {
	SERVICE_FEE,PROCESS_FEE1,PROCESS_FEE2,REAL_AMOUNT,PROCESS_AMOUNT,SERVICE_AMOUNT
} from '../../../helpers/project'
import {
	togglePreloader
} from '../../../actions/preloader'
import {
	donateMoney,
	sendReceipt,
	clearDonateId
} from '../../../actions/project'

const createOptions = () => {
	return {
		style: {
			base: {
				fontSize: '16px',
				color: '#000',
				fontFamily: 'Roboto, Arial, sans-serif',
				':focus': {
					color: '#424770'
				},
				'::placeholder': {
					color: '#ccc',
				}
			}
		}
	}
};

class _CardForm extends Component {

	state = {
		name: '',
		
		hasError: false,
	};

	componentDidMount() {
		this.props.onRef(this)
	}

	componentWillUnmount() {
		this.props.onRef(undefined)
	}

	clearForm = () => {
		this._cardNumber && this._cardNumber.clear()
		this._cardExpiry && this._cardExpiry.clear()
		this._cardCVC && this._cardCVC.clear()
		this._cardZipcode && this._cardZipcode.clear()
		this.setState({
			name: ''
		})
	}

	handleChange = (res) => {
		let data = {
			hasError: false
		}
		this.setState(data)
	}

	inputChange = (field, e) => {
		this.setState({ [field]: e.target.value, hasError: false })
	}

	handleValidation = () => {
		let formIsValid = true

		// Name
		if (!this.state.name) {
			formIsValid = false
		}

		if (typeof this.state.name !== "undefined") {
			if (!this.state.name.match(/^[a-zA-Z ]+$/)) {
				formIsValid = false;
			}
		}

		if (!this.props.amount || isNaN(Number(this.props.amount)) || Number(this.props.amount) === 0) {
			formIsValid = false
		}

		this.setState({ hasError: !formIsValid })
		return formIsValid
	};

	handleSubmit = () => {
		if (this.props.stripe ) {
			if (this.handleValidation()) {
				this.props.stripe.createToken({ name: this.state.name }).then(res => {
					if (res.error) {
						this.setState({ hasError: true })
					} else {
						this.props.handleResult(res.token)
					}
				});
			}
		}
		else {
			// console.log("Stripe.js hasn't loaded yet.");
		}
	};

	render() {
		const {
			name,
			hasError
		} = this.state

		return (
		<div className="stripeFormWrapper">
			<form className="stripeForm">
				<div className="form-group">
					<input type="text" className="form-control" placeholder="CARD HOLDER'S NAME" onChange={(e) => this.inputChange("name", e)} value={name} />
				</div>
				<div className="form-group">
					<CardNumberElement
						placeholder="1234 1234 1234 1234"
						onReady={e => this._cardNumber = e}
						onChange={this.handleChange}
						{...createOptions()}
						className="card-element"
					/>
				</div>
				<div className="form-row">
					<div className="form-group">
						<div className="card-element">
							<CardExpiryElement
								placeholder="MM / YY"
								onReady={e => this._cardExpiry = e}
								ref="_cardExpiry"
								onChange={this.handleChange}
								{...createOptions()}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="card-element">
							<CardCVCElement
								placeholder="CVC"
								onReady={e => this._cardCVC = e}
								onChange={this.handleChange}
								{...createOptions()}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="card-element">
							<PostalCodeElement
								placeholder="Zip"
								onReady={e => this._cardZipcode = e}
								onChange={this.handleChange}
								{...createOptions()}
							/>
						</div>
					</div>
				</div>
			</form>
			<div className="text-center">
				<span className={`globalErrorHandler ${hasError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
					<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
					<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
					</svg>
					Your card information is invalid</span>
			</div>
		</div>
		);
	}
}

const CardForm = injectStripe(_CardForm);

class MoneyDonationModal extends Component {

	state = {
		step: 0,
		amount: '',
		firstName: "",
		lastName: "",
		email: "",
		hasContactError: false,
		hasAmountError: false,
		showServiceFee: false,
	}

	componentDidMount() {
		if (this.props.isAuth) {
			this.setState({ step: 1 })
		}
	}

	componentWillReceiveProps(nextprops) {
		if (nextprops.preloader.actionName === 'submittingDonate') {
			if (this.props.showModal && nextprops.preloader.show === false) {
				this.setState({ step: 2 })
			}
		}
	}

	handleResult = token => {
		let data = {
			project: this.props.project._id,
			amount: this.state.amount,
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			token: token.id
		}

		this.props.donateMoney(data)
	}

	closeModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.clearStripeForm()
			this.props.togglePreloader({ show: true, actionName: '' })
			this.props.clearDonateId()
			this.props.closeModal()
			let step = 0
			if (this.props.isAuth) {
				step = 1
			}
			this.setState({ step, amount: '', firstName: '', lastName: '', email: '' })
		}
	}

	changeDonationValue = e => {
		let amount = Number(e.target.value)
		if (amount < 0) {
			amount = 0
		}
		this.setState({ amount, hasAmountError: false })
	}

	clearStripeForm = () => {
		if (this.stripeform) {
			this.stripeform.clearForm()
		}
	}

	toggleServiceFeeBlock = () => {
		this.setState({ showServiceFee: !this.state.showServiceFee })
	}

	nextStep = () => {
		switch (this.state.step) {
			case 0:
				if (this.state.amount !== '' && Number(this.state.amount) !== 0) {
					if (this.props.isAuth || (!this.isAuth && this.state.email !== '' && this.state.firstName !== '' && this.state.lastName !== '')) {
						this.setState({ step: 1 })
					}
					else {
						this.setState({ hasContactError: true })
					}
				}
				else {
					this.setState({ hasAmountError: true })
				}
				break
			case 1:
				if (this.state.amount !== '' && Number(this.state.amount) !== 0) {
					this.stripeform.handleSubmit()
				} else {
					this.setState({ hasAmountError: true })
				}
				break
			default:
				break
		}
	}

	viewReceipt = () => {
		history.push(`/${this.props.userId}`)
	}

	sendReceipt = () => {
		const data = {
			donate_id: this.props.donate_id
		}
		this.props.sendReceipt(data)
	}

	done = () => {
		let step = 0
		if (this.props.isAuth) {
			step = 1
		}
		this.setState({ step, amount: 0, firstName: '', lastName: '', email: '' })
		this.clearStripeForm()
		this.props.togglePreloader({ show: true, actionName: '' })
		this.props.clearDonateId()
		this.props.closeModal()
	}

	inputChange = (field, e) => {
		this.setState({ [field]: e.target.value, hasContactError: false })
	}

	render() {
		
		const {
			step,
			amount,
			hasContactError,
			hasAmountError,
			showServiceFee
		} = this.state

		const {
			isAuth
		} = this.props

		return (
			<Modal title="" className="donationModal" width="400px" padding="30px 35px" showModal={this.props.showModal} closeModal={this.closeModal}>
				{ step === 0 && 
					<div className="step">
						<div className="modal-title center">Enter Your Donation Information</div>
						<div className="separator-25" />
						<div className="text-center donate-input">
							<label className="text-blue">Amount</label> <span className="input-wrapper"><input type="number" name="donationValue" placeholder="0" className="donationValue" onChange={this.changeDonationValue} value={amount} /></span>
						</div>
						<div className="text-center">
							<span className={`globalErrorHandler ${hasAmountError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
								<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
								<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
								</svg>
								Please input amount!</span>
						</div>
						<div className="form-group">
							<span className="control-label">First Name</span>
							<input type="text" placeholder="First Name..." className="form-control" onChange={(e) => this.inputChange("firstName", e)} />
						</div>
						<div className="form-group">
							<span className="control-label">Last Name</span>
							<input type="text" placeholder="Last Name..." className="form-control" onChange={(e) => this.inputChange("lastName", e)} />
						</div>
						<div className="form-group">
							<span className="control-label">Email Address</span>
							<input type="email" placeholder="Email Address..." className="form-control" onChange={(e) => this.inputChange("email", e)} />
						</div>
						<div className="text-center">
							<span className={`globalErrorHandler ${hasContactError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
								<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
								<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
								</svg>
								All fields are required!</span>
						</div>
						<div className="separator-25"/>
						<div className="modal-row center">
							<Button solid label="Next" padding="6px 32px" onClick={() => this.nextStep()} />
						</div>
					</div>
				}
				{ step === 1 && <div className="step">
					<div className="modal-title label text-center">Enter Your Donation Information</div>
					{isAuth && <div>
						<div className="separator-25"></div>
						<div className="text-center donate-input">
							<label className="text-blue">Amount</label> <span className="input-wrapper"><input type="number" name="donationValue" placeholder="0" className="donationValue" onChange={this.changeDonationValue} value={amount} /></span>
						</div>
						<div className="text-center">
							<span className={`globalErrorHandler ${hasAmountError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
								<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
								<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
								</svg>
								Please input amount!</span>
						</div>
					</div>}
					<div className="separator-25"></div>
					<StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
						<Elements>
							<CardForm onRef={ref => (this.stripeform = ref)} amount={amount} handleResult={this.handleResult} />
						</Elements>
					</StripeProvider>
					<div className="donation-informations">
						<div className="donation-information">
							<label>Donation Amount</label><label>${amount || 0}</label>
						</div>
						<div className="donation-information">
							<label>Processing Fee <span>{PROCESS_FEE1}% + {PROCESS_FEE2 * 100}cents</span></label><label>${PROCESS_AMOUNT(amount)}</label>
						</div>
						<div className="donation-information">
							<label>Service Fee <span>{SERVICE_FEE}%</span></label><label>${SERVICE_AMOUNT(amount)}</label>
						</div>
					</div>
					<div className={`accordion ${showServiceFee ? 'open' : ''}`}>
						<span className="accordion-header" onClick={() => this.toggleServiceFeeBlock()}>Why a Service Fee? <img className="caret" alt="Caret" src="/images/ui-icon/dropdown.svg" /></span>
						<div className="accordion-content">
							The service fee on our platform keep OneGivv up and powering the diffrent features we have avilavble. It also allow us to give nonprofits 100% of your donations! If you want to learn more about what services we provide, <a href="/" className="text-blue">click here!</a>
						</div>
					</div>
					<div className="feature-divider"></div>
					<div className="donation-information text-blue">
						<span>Total</span><label>${REAL_AMOUNT(amount)}</label>
					</div>
					<div className="text-center">
						<Button solid label="Complete" padding="6px 32px" onClick={() => this.nextStep()} />
					</div>
				</div> }
				{ step === 2 && 
					<div className="step">
						<div className="text-center"><label>Success</label></div>
						<div className="separator-20"></div>
						<div className="success-box">
							<FontAwesomeIcon icon="check" className="_icon" />
						</div>
						<div className="separator-20"></div>
						<p className="text-center">Success!! Your donation was successfully  Completed!</p>
						<div className="separator-20"></div>
						<Card className="type-wrapper" padding="0">
							{ this.props.isAuth && <button className={`wrapper animation-click-effect`} onClick={() => this.viewReceipt()}><span>View receipt</span></button> }
							{ !this.props.isAuth && <button className={`wrapper animation-click-effect`} onClick={() => this.sendReceipt()}><span>Send receipt</span></button> }
							<button onClick={() => this.done()} className={`wrapper animation-click-effect active`}><span>Done</span></button>
						</Card>
					</div> }
			</Modal>
		)
	}
}


const mapStateToProps = state => ({
	preloader: state.preloader,
	isAuth: state.authentication.isAuth,
	userId: state.authentication.userId,
	donate_id: state.project.donate_id
})

const mapDispatchToProps = {
	donateMoney,
	sendReceipt,
	clearDonateId,
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MoneyDonationModal)