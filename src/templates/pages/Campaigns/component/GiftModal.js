import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select, { components } from 'react-select';
import moment from 'moment';

import {
	createContact,
	clearNewContact,
	getContacts,
	clearContacts
} from '../../../../actions/contact';

import { createGift } from '../../../../actions/gift';

import Modal from '../../../common/Modal';
import Button from '../../../common/Button';
import Card from '../../../common/Card';

const selectStyles = {
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	control: styles => ({ ...styles, minHeight: 34, borderRadius: 8, borderColor: '#DDDDDD' }),
	placeholder: styles => ({ ...styles, color: '#ccc' })
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/search.svg" alt="" />
			</components.DropdownIndicator>
		)
	);
};

class GiftModal extends Component {

	state = {
		fields: {
			fullName: '',
			email: '',
			address: '',
			phone_prefix: '',
			phone_suffix: ''
		},
		errors: {},
		optionContacts: [],
		contactId: '',
		type: '',
		amount: 0,
		isNewContact: false,
		isContactChosen: false,
		isContactSelected: false,
		filter: ''
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.contacts.length > 0) {
			let _contacts = nextProps.contacts.map(e => {
				return { value: e._id, label: e.fullName }
			})
			this.setState({ optionContacts: _contacts })
		}
		if (nextProps.newContact._id) {
			this.props.clearNewContact()
			this.setState({ contactId: nextProps.newContact._id, isContactSelected: true })
		}
	}

	handleContactValidation() {
		let fields = this.state.fields;
		let errors = {};
		let formIsValid = true;

		// Name
		if (!fields["fullName"]) {
			formIsValid = false;
			errors["fullName"] = "Cannot be empty";
		}

		if (typeof fields["fullName"] !== "undefined") {
			if (!fields["fullName"].match(/^[a-zA-Z ]+$/)) {
				formIsValid = false;
				errors["fullName"] = "Name is not valid";
			}
		}

		// Email
		if (!fields["email"]) {
			formIsValid = false;
			errors["email"] = "Name is valid";
		}

		if (typeof fields["email"] !== "undefined") {
			let lastAtPos = fields["email"].lastIndexOf('@');
			let lastDotPos = fields["email"].lastIndexOf('.');

			if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
				formIsValid = false;
				errors["email"] = "Email is not valid";
			}
		}

		// Address
		if (!fields["address"]) {
			formIsValid = false;
			errors["address"] = "Address is not valid";
		}

		// Phone prefix
		if (!fields["phone_prefix"]) {
			formIsValid = false;
			errors["phone"] = "Phone number is not valid";
		}

		if (typeof fields["phone_prefix"] !== "undefined") {
			if (!fields["phone_prefix"].match(/^[0-9]{3,5}$/)) {
				formIsValid = false;
				errors["phone"] = "Phone number is not valid";
			}
		}

		// Phone suffix
		if (!fields["phone_suffix"]) {
			formIsValid = false;
			errors["phone"] = "Phone number is not valid";
		}

		if (typeof fields["phone_suffix"] !== "undefined") {
			if (!fields["phone_suffix"].match(/^[0-9]*$/)) {
				formIsValid = false;
				errors["phone"] = "Phone number is not valid";
			}
		}

		this.setState({errors: errors});
		return formIsValid;
	}

	handleGiftValidation() {
		let errors = {}
		let formIsValid = true

		// Type
		if (!this.state.type) {
			formIsValid = false;
			errors["type"] = "Gift type is not valid";
		}

		// Amount
		if (!this.state.amount) {
			formIsValid = false;
			errors["amount"] = "Gift amount is not valid";
		}

		if (typeof this.state.amount !== "undefined") {
			if (!this.state.amount.toString().match(/^[0-9]*$/) || this.state.amount.toString() === "0") {
				formIsValid = false;
				errors["amount"] = "Gift amount is not valid";
			}
		}

		this.setState({errors: errors})
		return formIsValid
	}

	contactInputChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({fields, isNewContact: true});
	}

	giftInputChange(field, e) {
		this.setState({ [field]: e.target.value })
	}

	contactSubmit = () => {
		if (this.handleContactValidation()) {
			let data = {
				fullName: this.state.fields.fullName,
				email: this.state.fields.email,
				address: this.state.fields.address,
				phone: `${this.state.fields.phone_prefix}${this.state.fields.phone_suffix}`
			}
			this.props.createContact(data)
		}
	}

	giftSubmit() {
		if (this.handleGiftValidation()) {
			let data = {
				contact: this.state.contactId,
				type: this.state.type,
				amount: Number(this.state.amount)
			}

			this.props.createGift(data)
			this.clearInputs()
			this.props.clearContacts()
			this.props.closeModal()
		}
	}

	createNewContact = () => {
		let fields = {
			fullName: "",
			email: "",
			address: "",
			phone_prefix: "",
			phone_suffix: ""
		}
		this.setState({ fields, isNewContact: true, isContactChosen: false })
	}

	onFilterChange = (e) => {
		if (e !== "") {
			this.setState({ filter: e })
		}
	}

	filterContacts = (e) => {
		// this.setState({ filter: e.target.value })
		if (e.keyCode === 13) {
			this.props.getContacts({
				type: 'all',
				search: e.target.value,
				skip: 0,
				limit: 10
			})
		}
	}

	chooseContact = e => {
		if (e) {
			let contact = this.props.contacts.find(c => e.value === c._id)
			if (contact) {
				let fields = {
					fullName: contact.fullName,
					email: contact.email,
					address: contact.address,
					phone_prefix: contact.phone.substr(0, 3),
					phone_suffix: contact.phone.substr(3)
				}
				this.setState({ isNewContact: false, isContactChosen: true, fields, contactId: e.value, errors: {} })
			}
		}
	}

	selectContact = () => {
		this.setState({ isContactSelected: true })
	}

	closeModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.clearInputs()
			this.props.clearContacts()
			this.props.closeModal()
		}
	}

	clearInputs = () => {
		this.setState({
			fields: {
				fullName: "",
				email: "",
				address: "",
				phone_prefix: "",
				phone_suffix: ""
			},
			errors: {},
			optionContacts: [],
			contactId: "",
			type: "",
			amount: 0,
			isNewContact: false,
			isContactChosen: false,
			isContactSelected: false,
			filter: ""
		})
	}

	render() {
		const {
			fields,
			errors,
			type,
			amount,
			optionContacts,
			isNewContact,
			isContactChosen,
			isContactSelected,
			filter
		} = this.state

		const {
			showModal
		} = this.props

		return(
			<Modal title="Input New Gift" className="CampaignsGiftModal" width="1100px" showModal={showModal} closeModal={this.closeModal}>
				<div className="giftWrapper">
					<div className="giftForm">
						<h4 className="text-center">Create Gift</h4>
						<div className="form-group">
							<Select
								onChange={this.chooseContact}
								onInputChange={this.onFilterChange}
								onKeyDown={this.filterContacts}
								options={optionContacts}
								placeholder=""
								isClearable={false}
								isDisabled={isContactSelected}
								isSearchable
								controlShouldRenderValue={true}
								inputValue={filter}
								menuContainerStyle={{zIndex: 1000}}
								styles={selectStyles}
								components={{ DropdownIndicator }}
							/>
						</div>
						<div className={`form-group ${isContactSelected ? 'selected' : ''}`}>
							<input ref="fullName" type="text" className="placeholder" size="30" placeholder="Full Name" value={fields["fullName"]} readOnly />
						</div>
						<div className={`form-group ${isContactSelected ? 'selected' : ''}`}>
							<input refs="email" type="text" className="placeholder" size="30" placeholder="Email" value={fields["email"]} readOnly />
						</div>
						<div className={`form-group ${isContactSelected ? 'selected' : ''}`}>
							<input refs="address" type="text" className="placeholder" placeholder="Address" value={fields["address"]} readOnly />
						</div>
						<div className={`form-group ${isContactSelected ? 'selected' : ''}`}>
							<div className="phone">
								<input refs="phone_prefix" className="placeholder phone_prefix" type="text" size="3" placeholder="(___)" value={fields["phone_prefix"]} readOnly />
								<input refs="phone_suffix" className="placeholder phone_suffix" type="text" size="30" placeholder="Phone" value={fields["phone_suffix"]} readOnly />
							</div>
						</div>
						<div className="form-group">
							<div className="gift">
								<div className="giftType">
									<label>Gift Type</label>
									<input refs="type" type="text" className="placeholder" placeholder="" onChange={this.giftInputChange.bind(this, "type")} value={type} />
									<span className="globalErrorHandler">{errors["type"]}</span>
								</div>
								<div className="giftAmount">
									<label>Gift Amount</label>
									<input refs="amount" type="number" className="placeholder" placeholder="" onChange={this.giftInputChange.bind(this, "amount")} value={amount} />
									<span className="globalErrorHandler">{errors["amount"]}</span>
								</div>
							</div>
						</div>
						<div className="separator-15" />
						<div className="form-group button-group text-center">
							<Button label="Save" disabled={!isContactSelected} padding="10px 35px" className="btn-large" onClick={() => this.giftSubmit()} />
						</div>
					</div>
					{!isContactSelected && !isContactChosen && !isNewContact &&
						<div className="contactNotfound">
							<h4 className="text-center">Contact Match</h4>
							<label className="noMatches">No matches found</label>
							<div className="text-center"><Button label="Create New Contact" onClick={() => this.createNewContact()} /></div>
						</div>
					}
					{
						!isContactSelected && !isContactChosen && isNewContact &&
						<div className="newContact">
							<h4 className="text-center">Contact Match</h4>
							<div className="form-group">
								<input type="text" className="control" placeholder="Full Name" onChange={this.contactInputChange.bind(this, "fullName")} value={fields["fullName"]} />
								<span className="globalErrorHandler">{errors["fullName"]}</span>
							</div>
							<div className="form-group">
								<input type="text" className="control" placeholder="Email" onChange={this.contactInputChange.bind(this, "email")} value={fields["email"]} />
								<span className="globalErrorHandler">{errors["email"]}</span>
							</div>
							<div className="form-group">
								<input type="text" className="control" placeholder="Address" onChange={this.contactInputChange.bind(this, "address")} value={fields["address"]} />
								<span className="globalErrorHandler">{errors["address"]}</span>
							</div>
							<div className="form-group">
								<div className="phone">
									<input type="text" className="control phone_prefix" size="3" placeholder="(___)" onChange={this.contactInputChange.bind(this, "phone_prefix")} value={fields["phone_prefix"]} />
									<input type="text" className="control phone_suffix" onChange={this.contactInputChange.bind(this, "phone_suffix")} value={fields["phone_suffix"]} />
								</div>
								<span className="globalErrorHandler">{errors["phone"]}</span>
							</div>
							<div className="separator-15" />
							<div className="form-group text-center">
								<Button label="Create" padding="10px 35px" className="btn-large" onClick={() => this.contactSubmit()} />
							</div>
						</div>
					}
					{
						(isContactChosen || isContactSelected) &&
						<div className="giftTemplate">
							<Card>
								<span className="fullName">{fields.fullName}</span>
								<div className="separator-20" />
								<div className="infoWrapper">
									<div className="contactInfo">
										<div className="info"><span>{fields.address}</span></div>
										<div className="info"><span>{fields.email}</span></div>
										<div className="info"><span>+{fields.phone_prefix} {fields.phone_suffix}</span></div>
									</div>
									<div className="giftInfo">
										<div className="info"><label>Last Gift:</label><span>{moment().format('DD MMMM, YYYY')}</span></div>
										<div className="info"><label>Amount:</label><span>$ {amount}</span></div>
										<div className="info"><label>Total Giving:</label><span>$ {amount}</span></div>
									</div>
								</div>
							</Card>
							<div className="separator-30" />
							{!isContactSelected && <div className="text-center">
									<Button label="Select Contact" padding="10px 35px" className="btn-large" onClick={() => this.selectContact()} />
									<div className="createNewContact" onClick={() => this.createNewContact()}>Not contact, create new contact</div>
								</div>
							}
						</div>
					}
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	contacts: state.contact.contacts,
	newContact: state.contact.newContact
})

const mapDispatchToProps = {
	createContact,
	clearNewContact,
	getContacts,
	clearContacts,
	createGift
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GiftModal)