import React, {Component, Fragment} from 'react'
import { connect } from 'react-redux'
import Select, { components } from 'react-select'
import { history } from '../../../../../store'
import Button from '../../../../common/Button'
import Card from '../../../../common/Card'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement,
	StripeProvider,
	injectStripe,
	Elements,
} from 'react-stripe-elements';

import {
	getProjectByParams,
	clearProjectsList
} from '../../../../../actions/project'

import {
	giveDonate,
	sendReceipt,
	clearGiveId
} from '../../../../../actions/give'

import {
	togglePreloader
} from '../../../../../actions/preloader'

import { DONATION } from '../../../../../helpers/projectTypes'
import {
	SERVICE_FEE,PROCESS_FEE1,PROCESS_FEE2,REAL_AMOUNT,SERVICE_AMOUNT,PROCESS_AMOUNT
} from '../../../../../helpers/project'

const selectStyles = {
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	control: styles => ({ ...styles, fontSize: 14, minHeight: 34, borderRadius: 16, borderColor: '#DDDDDD' }),
	placeholder: styles => ({ ...styles, color: '#666' })
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/dropdown.svg" alt="" />
			</components.DropdownIndicator>
		)
	)
}

const stripeOptions = () => {
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
}

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
					}
					else {
						this.props.handleResult(res.token)
					}
				});
			}
		} else {
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
						{...stripeOptions()}
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
								{...stripeOptions()}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="card-element">
							<CardCVCElement
								placeholder="CVC"
								onReady={e => this._cardCVC = e}
								onChange={this.handleChange}
								{...stripeOptions()}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="card-element">
							<PostalCodeElement
								placeholder="ZIP"
								onReady={e => this._cardZipcode = e}
								onChange={this.handleChange}
								{...stripeOptions()}
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

class DonationForm extends Component {
	state = {
		step: 0,
		donationType: 0,
		projectList: [],
		selectedProjectId: "-1",
		frequncyList:[
			{
				value: "0",
				label: "Every Month"
			},
			{
				value: "1",
				label: "Every Week"
			},
			{
				value: "2",
				label: "Every Two Weeks"
			}
		],
		frequency: 0,
		memo: '',
		amount: '',
		firstName: '',
		lastName: '',
		email: '',
		hasContactError: false,
		hasAmountError: false,
		showServiceFee: false
	}

	componentDidMount() {
		this.getProjects()
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.projects.length !==  0) {
			let {projectList} = this.state

			projectList = nextProps.projects.map((e) => {
				return {
					value: e._id,
					label: e.title
				}
			})
			projectList.unshift({
				value: '-1',
				label: 'General Donation'
			})
			this.setState({projectList: projectList})
		} else {
			let projectList = []
			projectList.push({
				value: '-1',
				label: 'General Donation'
			})
			this.setState({projectList: projectList})
		}

		if (nextProps.preloader.actionName === 'givingDonate' && nextProps.preloader.show === false) {
			this.setState({ step: 3 })
		}
	}

	componentWillUnmount() {
		this.props.clearGiveId()
		this.props.clearProjectsList()
		this.props.togglePreloader({ show: true, actionName: '' })
	}

	inputHelper = key => e => {
		let value = e.target.value
		if (key === 'amount' && Number(value) < 0) {
			value = 0
		}
		this.setState({ [key]: value, hasContactError: false, hasAmountError: false })
	}

	toggleServiceFeeBlock = () => {
		this.setState({ showServiceFee: !this.state.showServiceFee })
	}

	getProjects() {
		let skip = 0
		let limit = this.props.selectedUser.projectsCount
		if (limit !== 0) {
			let userId = this.props.selectedUser._id
			let activeType = DONATION // project type donation get
			this.props.getProjectByParams({
				skip,
				limit,
				activeType,
				userId
			})
		}
	}

	onNextStep = () => {
		switch (this.state.step) {
			case 0:
				if (this.state.amount !== '' && Number(this.state.amount) !== 0) {
					if (this.props.isAuth) {
						this.setState({ step: 2 })
					}
					else {
						this.setState({ step: 1 })
					}
				}
				else {
					this.setState({ hasAmountError: true })
				}
				break;
			case 1:
				if (!this.isAuth && this.state.email !== '' && this.state.firstName !== '' && this.state.lastName !== '') {
					this.setState({ step: 2 })
				}
				else {
					this.setState({ hasContactError: true })
				}
				break;
			case 2:
				this.stripeform.handleSubmit()
				break;
			default:
				break;
		}
	}

	onDonationType = type => e => {
		this.setState({donationType: type})
	}

	onSelectHelper = key => e => {
		if (key === 'selectedProjectId') {
			if (e.value !== "-1")
				this.setState({donationType: 0})
		}
		this.setState({[key]: e.value})
	}

	handleResult = token => {
		let { memo, amount, donationType, frequencySelected } = this.state

		var data = {
			nonprofit: this.props.selectedUser._id,
			type: DONATION,
			giveAt: moment().format('X'),// moment.unix(moment()),
			amount: amount,
			memo: memo,
			donationType: donationType,
			frequency: frequencySelected,
			email: this.state.email,
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			token: token.id
		}

		this.props.giveDonate(data)
	}

	viewReceipt = () => {
		history.push(`/${this.props.userId}`)
	}

	sendReceipt = () => {
		const data = {
			giveId: this.props.giveId
		}
		this.props.sendReceipt(data)
	}

	done = () => {
		this.props.closeModal()
	}

	render() {
		const {
			step,
			donationType,
			projectList, 
			selectedProjectId,
			frequncyList,
			memo,
			amount,
			hasContactError,
			hasAmountError,
			showServiceFee
		} = this.state

		const {
			isAuth
		} = this.props
		return (
			<section className="modal-donation-form">
				{ step === 0 && <div className="donation-step-1">
					<div className="modal-title center">Enter Your Donation Information</div>
					<div className="separator-25" />
					<div className="modal-row center">
						<span className="label-amount">Amount</span>
						<span className="amount-wrapper"><input type="number" placeholder="0" className="value-amount" onChange={this.inputHelper('amount')} value={amount} /></span>
					</div>
					<div className="text-center">
						<span className={`globalErrorHandler ${hasAmountError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
							<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
							<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
							</svg>
							Please input amount!</span>
					</div>
					<div className="separator-15"/>
					<div className="modal-row center">
						<section className="donation-type">
							<button className={`button give ${donationType=== 0 && 'active'}`} onClick={this.onDonationType(0)}>Give one time</button>
							<button className={`button recur ${donationType=== 1 && 'active'}`} onClick={this.onDonationType(1)} disabled={selectedProjectId !== '-1'}>Set up recurring</button>
						</section>
					</div>
					<div className="separator-15"/>
					<div className="modal-row">
						<span className="label">Fund</span>
						<Select
							className="value"
							options={projectList}
							placeholder=""
							isClearable={false}
							isSearchable={false}
							menuContainerStyle={{zIndex: 1000}}
							styles={selectStyles}
							components={{ DropdownIndicator }}
							onChange={this.onSelectHelper('selectedProjectId')}
						/>
					</div>
					<div className="separator-15"/>
					<div className="modal-row">
						<span className="label">Memo(optional)</span>
						<input className="memo-input" value={memo} onChange={this.inputHelper('memo')} placeholder="Leave a message here....."/>
					</div>
					{ donationType === 1 && <Fragment >
						<div className="separator-15"/>
						<div className="modal-row">
							<span className="label">Frequency</span>
							<Select
								className="frequency-value"
								placeholder="Every Month"
								isClearable={false}
								isSearchable={false}
								menuContainerStyle={{zIndex: 1000}}
								styles={selectStyles}
								components={{ DropdownIndicator }}
								options={frequncyList}
								onChange={this.onSelectHelper("frequencySelected")}
							/>
						</div>
					</Fragment> }
					<div className="separator-30"/>
					<div className="modal-row center">
						<Button label="Next" padding="6px 32px" solid noBorder onClick={this.onNextStep}/>
					</div>
				</div> }
				{ step === 1 && !isAuth && <div className="donation-step-2">
					<div className="modal-title center">Enter Your Donation Information</div>
					<div className="separator-25" />
					<div className="form-group">
						<span className="control-label">First Name</span>
						<input type="text" placeholder="First Name..." className="form-control" onChange={this.inputHelper('firstName')} />
					</div>
					<div className="form-group">
						<span className="control-label">Last Name</span>
						<input type="text" placeholder="Last Name..." className="form-control" onChange={this.inputHelper('lastName')} />
					</div>
					<div className="form-group">
						<span className="control-label">Email Address</span>
						<input type="email" placeholder="Email Address..." className="form-control" onChange={this.inputHelper('email')} />
					</div>
					<div className="text-center">
						<span className={`globalErrorHandler ${hasContactError && 'show'}`}><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
							<path className="base" fill="#000" d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"></path>
							<path className="glyph" fill="#FFF" d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"></path>
							</svg>
							All fields are required!</span>
					</div>
					<div className="separator-50"/>
					<div className="modal-row center">
						<Button label="Next" padding="6px 32px" solid noBorder onClick={this.onNextStep}/>
					</div>
				</div>}
				{ step === 2 && <div className="donation-step-3">
					<div className="separator-20"></div>
					<StripeProvider apiKey={process.env.REACT_APP_STRIPE_API_KEY}>
						<Elements>
							<CardForm onRef={ref => (this.stripeform = ref)} amount={REAL_AMOUNT(amount)} handleResult={this.handleResult} />
						</Elements>
					</StripeProvider>
					<div className="donation-informations">
						<div className="donation-information">
							<label>Donation Amount</label><label>${amount}</label>
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
							The service fee on our platform is to keep OneGivv running and powering the various features we have available. It also allows us to give nonprofits 100% of your donations! If you want to learn more about what services we provide, <a href="/" className="text-blue">click here!</a>
						</div>
					</div>
					<div className="feature-divider"></div>
					<div className="donation-information text-blue">
						<span>Total</span><label>${REAL_AMOUNT(amount)}</label>
					</div>
					<div className="center">
						<Button label="Complete" padding="6px 32px" solid noBorder onClick={this.onNextStep}/>
					</div>
				</div> }
				{ step === 3 && <div className="donation-step-4">
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
			</section>
		)
	}
}

const mapStateToProps = state => ({
	userId: state.authentication.userId,
	isAuth: state.authentication.isAuth,
	projects: state.project.projects,
	preloader: state.preloader,
	giveId: state.give.giveId
})

const mapDispatchToProps = {
	getProjectByParams,
	clearProjectsList,
	sendReceipt,
	giveDonate,
	clearGiveId,
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DonationForm)