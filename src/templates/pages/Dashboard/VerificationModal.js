import React, {Component} from 'react'
import { connect } from 'react-redux'
import Select, { components } from 'react-select'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import Textarea from 'react-textarea-autosize'
import {
	setVerifyStep
} from '../../../actions/user'
import {
	changePrivacySetting
} from '../../../actions/setting'
import {
	getAllInterests
} from '../../../actions/global'
import { PENDING } from '../../../helpers/userStatus';
//import { PENDING } from '../../../helpers/userStatus'

const OVERVIEWSTEP = 0
const BASICINFORMATION = 1
const PAYMENT = 2
const THANKSTEP = 3

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

class VerificationModal extends Component {
	state = {
		currentStep: OVERVIEWSTEP,
		overview: this.props.user.aboutUs || '',
		file: null,
		showError: false,
		allInterests: [],
		selected_interests: [],
		firstName: this.props.user.firstNameOfContact || "",
		lastName: this.props.user.lastNameOfContact ||"",
		phone: this.props.user.phoneOfContact ||"",
		website: this.props.user.websiteOfContact ||"",
		fbUrl: this.props.user.fbOfContact ||"",
		stripe_bank_account_token: this.props.user.firstNameOfContact ||""
	}

	componentDidMount() {
		this.props.getAllInterests()
	}

	onSelectInterest = target => {
		this.setState({ selected_interests: target })
	}

	nextStep = () => {
		const {currentStep, selected_interests, overview, firstName, lastName, phone, website, fbUrl} = this.state
				
		if (currentStep === OVERVIEWSTEP) {
			if (this.checkValidation()) {
				const data = {
					_id: this.props.user._id,
					interests: selected_interests.map(e => e.value),
					aboutUs: overview,
					nextStep: BASICINFORMATION
				}
				this.props.changePrivacySetting(data)
			}
		} else if (this.state.currentStep === BASICINFORMATION) {
			if (this.checkValidation()) {
				const data = {
					_id: this.props.user._id,
					firstNameOfContact: firstName,
					lastNameOfContact: lastName,
					phoneOfContact: phone,
					websiteOfContact: website,
					fbOfContact: fbUrl,
					nextStep: PAYMENT
				}
				this.props.changePrivacySetting(data)
			}
		} else if (this.state.currentStep === PAYMENT) {
			if (this.checkValidation()) {
				this.setState({currentStep: THANKSTEP}, () => {
					this.props.setVerifyStep(THANKSTEP)
					//this.props.handleChange('currentStep', THANKSTEP)
				})
			}
		} else if (this.state.currentStep === THANKSTEP) {
			const data = {
				_id: this.props.user._id,
				status: PENDING
			}
			this.props.changePrivacySetting(data)
			this.props.closeModal()
		}
	}

	checkValidation = () => {
		let {currentStep, overview, firstName, lastName, phone} = this.state
		const {connectStatus} = this.props
		let _valid = true
		switch (currentStep) {
			case OVERVIEWSTEP:
				if(overview === '')
					_valid = false
				break;
			case BASICINFORMATION:
				if(firstName === "" || lastName === "" || phone === "") 
					_valid = false
				break;
			case PAYMENT:
				if (connectStatus < 2)
					_valid = false
				break;
			default:
				break;
		}
		return _valid
	}

	inputHelper = key => e => this.setState({ [key]: e.target.value })

	closeModal = () => {
		this.props.closeModal()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentStep === OVERVIEWSTEP) {
			this.setState({currentStep: OVERVIEWSTEP})
		} else if (nextProps.currentStep === BASICINFORMATION) {
			this.setState({currentStep: BASICINFORMATION})
		} else if (nextProps.currentStep === PAYMENT) {
			this.setState({currentStep: PAYMENT})
		}
		if (nextProps.all_interests) {
			const allInterests = nextProps.all_interests.map(e => {
				return { value: e._id, label: e.title }
			})

			if(nextProps.user.interests) {				
				const selected_interests = allInterests.filter(e => {
					if(nextProps.user.interests.indexOf(e.value) !== -1)
						return true
					return false
				})
				this.setState({selected_interests})
			}
			this.setState({allInterests})
		}
		if (nextProps.stripeBankAccountToken !== '') {
			this.setState({stripe_bank_account_token: nextProps.stripeBankAccountToken})
		}
	}

	onClickBack = e => {
		const {currentStep} = this.state
		if(currentStep === OVERVIEWSTEP) {

		} else {
			this.props.setVerifyStep(currentStep - 1)
		}
	}

	render() {
		const {
			currentStep,
			overview,
			selected_interests,
			allInterests,
			firstName,
			lastName,
			phone,
			website,
			fbUrl
		} = this.state

		const {
			user,
			showModal,
			closeModal,
			connectStatus
		} = this.props
		return (
			<Modal title="" showModal={showModal} width="500px" padding="30px 30px" closeModal={closeModal}>
				{currentStep > OVERVIEWSTEP && <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack}/>}
				<div className="separator-20" />
				<div className="wizard-bar">
					<div className="steps">
						<div className={`wizard-step ${currentStep === OVERVIEWSTEP ? 'current' : ''} ${currentStep > OVERVIEWSTEP ? 'active' : ''}`}>
							<div className="step-icon" ></div>
						</div>
						<div className={`wizard-step ${currentStep === BASICINFORMATION ? 'current' : ''} ${currentStep > BASICINFORMATION ? 'active' : ''}`}>
							<div className="step-icon" ></div>
						</div>
						<div className={`wizard-step ${currentStep === PAYMENT ? 'current' : ''} ${currentStep > PAYMENT ? 'active' : ''}`}>
							<div className="step-icon" ></div>
						</div>
					</div>
				</div>
				<div className="wizard-content">
					{currentStep === OVERVIEWSTEP && <div>
						<div className="label">Tell us a little about what your nonprofit is all about!</div>
						<div className="separator-25"></div>
						<div className="control-label">Select Interests</div>
						<Select
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
							menuContainerStyle={{zIndex: 1000}}
							styles={selectStyles}
							components={{ DropdownIndicator }}
						/>
						<div className="separator-20" />
						<div className="control-label">Mission Statement (characters remaining: {500 - overview.length})</div>
						<Textarea
							className="control"
							value={overview}
							style={{ minHeight: 40 }}
							placeholder="We love seeing and hearing about all the diffrent causes that are out there! What is your mission?"
							id="userVerificationOverview"
							onChange={this.inputHelper('overview')}
						/>
					</div>}
					{currentStep === BASICINFORMATION && <div>
						<div className="label">Basic Information</div>
						<div className="separator-25"></div>
						<div className="row">
							<div className="col">
								<div className="control-label">First Name of Primary Contact</div>
								<input className="control-value" placeholder="First Name..." value={firstName} onChange={this.inputHelper('firstName')}/>
							</div>
							<div className="col">
								<div className="control-label">Last Name Primary Contact</div>
								<input className="control-value" placeholder="Last Name..."  value={lastName} onChange={this.inputHelper('lastName')}/>
							</div>
						</div>
						<div className="separator-20"></div>
						<div className="row">
							<div className="col">
								<div className="control-label">Contact Phone Number</div>
								<input className="control-value" placeholder="000-000-0000"  value={phone} onChange={this.inputHelper('phone')}/>
							</div>
							<div className="col">
								<div className="control-label">Website (optional)</div>
								<input className="control-value" placeholder="www.OneGivv.com" value={website} onChange={this.inputHelper('website')}/>
							</div>
						</div>
						<div className="separator-20"></div>
						<div className="row">
							<div className="col-full">
								<div className="control-label">Facebook page URL (optional) </div>
								<input className="control-value" placeholder="https://www.facebook.com/OneBenefactor"  value={fbUrl} onChange={this.inputHelper('fbUrl')}/>
							</div>							
						</div>
						<div className="separator-40"></div>
					</div>}
					{currentStep === PAYMENT && <div className="text-center">
						<div className="label">Connect to bank account. This account is where OneGivv will send donations you receive.</div>
						<div className="separator-30"></div>
						<a className="connect-bank" href={`https://connect.stripe.com/express/oauth/authorize?redirect_uri=${process.env.REACT_APP_STRIPE_REDIRECT_URI}&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&state=read_write&state=${user._id}#/`}>
							<span className="title">Connect Stripe</span>
							<div className="separator-10"></div>
							<img src="/images/ui-icon/stripe-cards.png" alt="Card Icons" />
						</a>
						<div className="separator-15" />
						{connectStatus === 1 && <span className="error">Stripe Connect Error</span>}
						{connectStatus === 2 && <span className="success">Stripe Connected</span>}
						<div className="separator-50"></div>
					</div>}
					{currentStep === THANKSTEP && <div className="text-center">
						<div className="donation-result center">Success</div>
						<div className="separator-15" />
						<div >
							<img className="donation-result-img" src="/images/ui-icon/donation/icon-success.svg" alt="success"/>
						</div>
						<div className="separator-20" />
						<div className="result-desc">
							You've successfully submitted your verification information, We will be in touch shortly!
						</div>
						<div className="separator-20"/>
					</div>}
				</div>
				<div className="wizard-footer">
					<Button padding="5px 45px" label={`${currentStep === THANKSTEP ? 'Done' : currentStep === PAYMENT ? 'Submit' : 'Next'}`} onClick={this.nextStep} solid noBorder />
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	all_interests: state.globalReducer.interests
})

const mapDispatchToProps = {
	getAllInterests,
	changePrivacySetting,
	setVerifyStep
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VerificationModal)