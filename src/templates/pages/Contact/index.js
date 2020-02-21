import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import Button from '../../common/Button';
import ContactInfo from './ContactInfo';
import Modal from '../../common/Modal';
import ContentModal from '../../common/Modal/ContentModal';
import * as EmailValidator from 'email-validator';

import 'react-phone-number-input/style.css';

import InputMask from 'react-input-mask';
import Pagination from "react-js-pagination";
import Placeholder from '../../common/noContentPlaceholder';
import {
	createContact,
	getContacts,
	clearContacts,
	editContact,
	deleteContact,
	uploadContactList,
	getContactDetail,
	sendInviteContact
} from '../../../actions/contact';
import { toggleNotification } from '../../../actions/notificationActions';

import { isValidPhoneNumber } from 'react-phone-number-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CheckBox from '../../common/CheckBox';
import Select, { components } from 'react-select';
import csv from 'csv';

// import ContactHeader from './ContactHeader/index';
import { NavLink } from 'react-router-dom';
import ContactHeader from './ContactHeader';
import ContactDetailModal from './ContactDetailModal';

const selectStyles = {
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	control: styles => ({ ...styles, minHeight: 34, borderRadius: 8, borderColor: '#DDDDDD' }),
	placeholder: styles => ({ ...styles, color: '#ccc' })
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/icon-filter.svg" alt="" />
			</components.DropdownIndicator>
		)
	);
};

class Contact extends Component {

	constructor(props) {
		super(props)
		this.previewRef = React.createRef()
	}

	state = {
		contactDetailInfo: null,
		activePage: 1,
		user: {},
		searchTxt: "",
		skip: 0,
		limit: 10,
		selectedContactId: null,
		showAddModal: false,
		showImportModal: -1,
		file: null,
		validation: {
			name: false,
			email: false,
			address: false,
			phone: false,
			birthDate: false
		},
		value: {
			name: "",
			email: "",
			address: "",
			phone1: "",
			phone2: "",
			birthDate: moment()
			.subtract(16, 'year')
			.subtract(1, 'day')
			.format('YYYY-MM-DD')
		},
		touched: {
			name: false,
			email: false,
			address: false,
			phone: false,
			birthDate: false
		},
		deletingContact: null,
		optionContacts: [{
			value: 'fullName',
			label: 'Full Name'
		}, {
			value: 'firstName',
			label: 'FirstName'
		}, {
			value: 'lastName',
			label: 'LastName'
		}, {
			value: 'email',
			label: 'Email'
		}, {
			value: 'address',
			label: 'Address'
		}, {
			value: 'phone',
			label: 'Phone'
		}, {
			value: 'birthDate',
			label: 'BirthDate'
		}],
		isHaveTitles: false,
		csvContactArray: [],
		csvShowArray: [],
		selectHeader: [],
		isFullNameCheck: false,
		isEmailCheck: false,
		isPhoneCheck: false,
		userId: null,
		currentTab: "all",
		headerKey: [],
		showContactDetailModal: false
	}

	static getDerivedStateFromProps(props, state) {
		return state;
	}

	componentDidMount() {
		const {id} = this.props.match.params
		if (id !== null) {
			this.setState({userId: id});
		} else {
			this.props.history.push('/');
		}

		this.getData();
	}

	componentWillUnmount() {
	}

	getData = () => {
		this.setState({ skip: this.state.limit * (this.state.activePage - 1) }, () => {
			this.props.getContacts({
				type: this.state.currentTab,
				search: this.state.searchTxt,
				skip: this.state.skip,
				limit: this.state.limit
			});
		})
	}

	closeAddModal = () => {
		this.setState({
			showAddModal: false, 
			value: {
				name: '',
				email: '',
				address: '',
				phone1: '',
				phone2: '',
				birthDate: moment()
				.subtract(16, 'year')
				.subtract(1, 'day')
				.format('YYYY-MM-DD'),
			}, validation: {
				name: false,
				email: false,
				address: false,
				phone: false,
				birthDate: false,
			}, touched: {
				name: false,
				email: false,
				address: false,
				phone: false,
				birthDate: false,
			}, selectedContactId: null
		})
	}

	showAddModal = () => {
		this.setState({ showAddModal: true });
	}

	onClickBody = (e) => {
		e.stopPropagation();
	}

	searchChange = (e) => {
		this.setState({ searchTxt: e.target.value });
	}

	handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.setState({ skip: 0, limit: 10 }, () => {
				this.getData();
			})
		}
	}

	onSearchContacts = e => {
		if (e)
			e.stopPropagation();

		this.setState({ skip: 0, limit: 10 }, () => {
			this.getData();
		});
	}

	handleChange = (field, e) => {
		let values = this.state.value;
		values[field] = e.target.value;
		this.setState({ values });
		if (field === "phone1") {
			if (values[field].indexOf("_") === -1) {
				let input = document.querySelector('.phone-second-input')
				input.focus();
			}
		}
		this.validate(field, e.target.value)
	}

	validate = (field, value) => {
		let validation = this.state.validation;
		if (field === "name" || field === "address") {
			validation[field] = value.length > 0
		} else if (field === "email") {
			validation[field] = EmailValidator.validate(value);
		} else if (field === "phone1" || field === "phone2") {
			const phone2 = this.state.value.phone2.replace("-", "").replace("/", "").replace(" ", "")
			validation.phone = isValidPhoneNumber("+1" + this.state.value.phone1.substr(1, 3) + "" + phone2)
		} else if(field === "birthDate") {
			var date = moment(value);
			validation[field] = date.isValid()
		}
		this.setState({ validation });
	}

	handleBlur = (field, evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true },
		});
	}

	showImportModal = () => {
		this.setState({ showImportModal: 0 })
	}

	closeImportModal = () => {
		this.setState({ showImportModal: -1, file: null }, () => {
			this.previewRef.current.value = ""
		})
	}

	openSelectFile = (e) => {
		e.stopPropagation();
		this.previewRef.current.click()
	}

	changeFile = e => {
		if (e.target.files.length === 0)
			return;

		if (e.target.files[0].name.indexOf('.csv') === -1) {
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Error',
				secondTitle: 'You can only upload CSV files',
				buttonText: 'Ok'
			})
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				var file = e.target.files[0]
				e.target.value = null
				this.setState({ file: file })
			} else {
				this.props.toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'File should be up to 10mb',
					buttonText: 'Ok'
				})
			}
		}
	}

	onClickAddContact = () => {
		if (this.state.selectedContactId) {
			this.props.editContact({
				_id: this.state.selectedContactId,
				fullName: this.state.value.name,
				address: this.state.value.address,
				email: this.state.value.email,
				phone: this.state.value.phone1 + " " + this.state.value.phone2,
				birthDate: moment(this.state.value.birthDate).utc().valueOf() / 1000,
				cb: () => {
					this.closeAddModal();
					this.getData();
				}
			})
		} else {
			this.props.createContact({
				fullName: this.state.value.name,
				address: this.state.value.address,
				email: this.state.value.email,
				phone: this.state.value.phone1 + " " + this.state.value.phone2,
				birthDate: moment(this.state.value.birthDate).utc().valueOf() / 1000,
				cb: () => {
					this.closeAddModal();
					this.getData();
				}
			})
		}
	}

	onClickImportContact = () => {
		const reader = new FileReader();
		let {headerKey} = this.state
		reader.onload = () => {
			csv.parse(reader.result, (err, data) => {
				let csvContactArray = []
				let csvShowArray = []
				data.forEach(d => {
					for(var i = 0; i < d.length; i ++) {
						headerKey[i] = {
							key: "",
							label: "Select"
						}
					}
					csvContactArray.push(JSON.parse(JSON.stringify(d)))
					csvShowArray.push(JSON.parse(JSON.stringify(d)))
				})
				this.setState({ showImportModal: 1, csvContactArray: csvContactArray, csvShowArray: csvShowArray, isHaveTitles: false, headerKey: headerKey })

			});
		};
		reader.readAsBinaryString(this.state.file);
	}

	contactEdit = (tar, contact) => {
		tar.stopPropagation();
		let phoneArray = contact.phone.split(" ");
		this.setState({
			showAddModal: true, value: {
				name: contact.fullName,
				email: contact.email,
				address: contact.address,
				phone1: phoneArray[0],
				phone2: phoneArray[1],
				birthDate: contact.birthdate
			}, validation: {
				name: true,
				email: true,
				address: true,
				phone: true,
				birthDate: true
			}, touched: {
				name: true,
				email: true,
				address: true,
				phone: true,
				birthDate: true
			}, selectedContactId: contact._id
		})
	}

	contactDelete = (tar, contact) => {
		tar.stopPropagation();
		this.setState({ deletingContact: contact })
	}

	sendInviteContact = (tar, contact) => {
		tar.stopPropagation();
		this.props.sendInviteContact({
			email: contact.email,
			fullName: contact.fullName
		});
	}

	handlePageChange = (pageNumber) => {
		this.setState({ activePage: pageNumber }, () => {
			this.getData()
		});
	}

	onClickContactInfo = (contact) => {
		this.props.getContactDetail(contact._id);
		this.setState({
			contactDetailInfo: contact
		}, () => {
			this.setState({
				showContactDetailModal: true
			});
		});
	}

	onClickCloseContactInfo = () => {
		this.setState({
			contactDetailInfo: null
		}, () => {
			this.setState({
				showContactDetailModal: false
			});
		});
	}

	onClickCloseDeleteDialog = () => {
		this.setState({ deletingContact: null })
	}

	onClickConfirmDelete = () => {
		this.props.deleteContact({
			id: this.state.deletingContact._id,
			cb: () => {
				this.getData();
				this.setState({ deletingContact: null })
			}
		});
	}

	deepCopyArray(arr) {
		return JSON.parse(JSON.stringify(arr))
	}

	toggleCheckbox = isChecked => {
		var content = this.deepCopyArray(this.state.csvContactArray)
		var {headerKey} = this.state
		headerKey.forEach(h => {
			h.key = "";
			h.label = "Select";
		})
		if (isChecked) {
			content = this.deepCopyArray(this.state.csvContactArray.slice(1))
			headerKey = [
				{
					key: 'fullName',
					label: 'Full Name'
				},{
					key: 'email',
					label: 'Email'
				},{
					key: 'address',
					label: 'Address'
				},{
					key: 'phone',
					label: 'Phone'
				},{
					key: 'birthDate',
					label: 'BirthDay'
				}
			]
		}
		this.setState({ isHaveTitles: isChecked, csvShowArray: content, headerKey: headerKey })
	}

	onClickImporBack = () => {
		this.setState({ showImportModal: this.state.showImportModal - 1 })
	}

	onClickImportNext = () => {
		var canNext = true;
		if (this.state.showImportModal === 1) {
			this.state.headerKey.forEach( h => {
				canNext = h.key !== ""
			})			
		}
		if (canNext)
			this.setState({ showImportModal: this.state.showImportModal + 1, isEmailCheck: false, isFullNameCheck: false, isPhoneCheck: false })
	}

	onSelectFieldHeader = (fieldKey, target) => {
		let { headerKey } = this.state
		headerKey[fieldKey].key = target.value
		headerKey[fieldKey].label = target.label
		this.setState({ headerKey })		
	}

	onClickSaveArray = () => {
		const {headerKey, csvShowArray} = this.state
		let newArray = csvShowArray.map(c => {
			var contact = {};
			for (var i = 0; i < c.length; i ++) {
				contact[headerKey[i].key] = c[i]
			}
			if (!contact.fullName) {
				contact.fullName = (contact.firstName || '') + " " + (contact.lastName || '')
			}
			return contact
		})

		let x = (array) => newArray.filter((v, i) => {
			const con = array.find(c => {
				var flag = true
				if (this.state.isFullNameCheck)
					flag &= (c.fullName === v.fullName)
				if (this.state.isEmailCheck)
					flag &= (c.email === v.email)
				if (this.state.isPhoneCheck)
					flag &= (c.phone === v.phone)
				if (flag)
					return v
				else
					return null
			})
			if (!this.state.isFullNameCheck && !this.state.isEmailCheck && !this.state.isPhoneCheck)
				return array.indexOf(v) === i
			else
				return array.indexOf(con) === i
		})
		newArray = x(newArray)
		

		this.props.uploadContactList({
			array: newArray, cb: () => {
				this.setState({ activePage: 1, showImportModal: -1, file: null, headerKey: [], csvShowArray: [], csvContactArray: [] }, () => {
					this.getData()
				})
			}
		})
	}

	toggleNameCheck = isChecked => {
		this.setState({ isFullNameCheck: isChecked })
	}

	toggleEmailCheck = isChecked => {
		this.setState({ isEmailCheck: isChecked })
	}

	togglePhoneCheck = isChecked => {
		this.setState({ isPhoneCheck: isChecked })
	}

	onContactTab = tab => {
		this.setState({
			skip: 0,
			limit: 10,
			currentTab: tab
		}, () => {
			this.props.getContacts({
				type: this.state.currentTab,
				search: this.state.searchTxt,
				skip: this.state.skip,
				limit: this.state.limit
			});
		});
	}

	onClickSupport = e => {
		window.Intercom('showNewMessage')
	}

	render() {
		const { contactDetailInfo, selectedContactId, searchTxt, showAddModal,
			validation, value, touched, showImportModal, file, deletingContact,
			optionContacts, isHaveTitles, csvShowArray, 
			isFullNameCheck, isEmailCheck, isPhoneCheck, 
			userId, currentTab, headerKey, showContactDetailModal } = this.state;

		const { contacts, totCount, contactDetail } = this.props

		return (
			<section className="contact-page  main-font CampaignsPage">
				<div className="row CompainContainer" style={{padding: '0px'}}>
					<ContactHeader userId={userId} onClickAdd={this.showAddModal} onClickImport={this.showImportModal} />
					{/* <Button
						onClick={this.showAddModal}
						className="new-contact"
						label="New Contact"
						padding="10px 30px"
					/>
					<Button
						onClick={this.showImportModal}
						className="import-contact"
						label="Import Contacts"
						padding="10px 26px"
					/> */}
				</div>
				<div className="separator-25" />
				<div className="CampaignsPageRequests">
					<div className="RequestsHeader">
						<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onContactTab('all')
						}} style={{textAlign: "right"}} >All Contacts</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'supporter' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onContactTab('supporter')
						}}>Supporters</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'invite' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onContactTab('invite')
						}} style={{textAlign: "left"}}>Invites</NavLink>
					</div>

					<div className="separator-25" />

					<div className="contact-box">
						<div className="header">
							<span className="header-title">Full Name</span>
							<span className="header-title birthday">Birthday</span>
							<span className="header-title">Email</span>
							<span className="header-title">Address</span>
							<span className="header-title phone">Phone</span>
							{/* <span className="header-title">Status</span> */}
							<span className="header-title action"></span>
						</div>
						<div className="search">
							<div className="search-box">
								<FontAwesomeIcon className="_icon" icon="search" onClick={this.onSearchContacts} />
								<input type="text" className="_input" placeholder="search..." value={searchTxt} onChange={this.searchChange} onKeyPress={this.handleKeyPress} />
							</div>
						</div>
						<div className="content-box">
							{ contacts.length !== 0 && contacts.map((e, i) => {
								return (
									<ContactInfo key={e._id} currentTab = {currentTab} contact={e} 
										contactEdit={(tar) => this.contactEdit(tar, e)} 
										contactDelete={(tar) => this.contactDelete(tar, e)} 
										sendInviteContact = { (tar) => this.sendInviteContact(tar, e) }
										border={i !== contacts.length - 1} 
										onClickContact={() => this.onClickContactInfo(e)} />
								)
							}) }
							{ contacts.length === 0 &&
								<Placeholder
									titleMain="You have no contacts"
								/> }
						</div>
						{ totCount > 10 && <div className="content-footer">
							<Pagination
								activePage={this.state.activePage}
								itemsCountPerPage={10}
								totalItemsCount={totCount}
								pageRangeDisplayed={5}
								onChange={this.handlePageChange}
							/>
						</div> }
					</div>
				</div>
				
				<Modal className="add-contact" title={`${selectedContactId ? 'Edit Contact' : 'Create Contact'}`} showModal={showAddModal} closeModal={this.closeAddModal} width="310px">
					<div className="content main-font" onClick={this.onClickBody}>
						<div className="contact-input">
							<input className="_input main-font" placeholder="Full Name" value={value.name} onChange={(e) => this.handleChange("name", e)} onBlur={(e) => this.handleBlur('name', e)} />
							{touched.name && validation.name && <img className="_img" src="/images/ui-icon/check.svg" alt="check" />}
						</div>
						<div className="validation-error">
							{touched.name && !validation.name && "Entered Full Name is incorrect, please try again"}
						</div>
						<div className="contact-input">
							<input className="_input main-font" placeholder="Email" value={value.email} onChange={(e) => this.handleChange("email", e)} onBlur={(e) => this.handleBlur('email', e)} />
							{touched.email && validation.email && <img className="_img" src="/images/ui-icon/check.svg" alt="check" />}
						</div>
						<div className="validation-error">
							{touched.email && !validation.email && "Entered Email is incorrect, please try again"}
						</div>
						<div className="contact-input">
							<input className="_input main-font" placeholder="Address" value={value.address} onChange={(e) => this.handleChange("address", e)} onBlur={(e) => this.handleBlur('address', e)} />
							{touched.address && validation.address && <img className="_img" src="/images/ui-icon/check.svg" alt="check" />}
						</div>
						<div className="validation-error">
							{touched.address && !validation.address && "Entered Address is incorrect, please try again"}
						</div>
						<div className="contact-input-phone">
							<div className="phone-first">
								<InputMask className="_input main-font" mask="(999)" maskChar="_" placeholder="(___)" value={value.phone1} onChange={(e) => this.handleChange("phone1", e)} onBlur={(e) => this.handleBlur('phone', e)} />
							</div>
							<div className="phone-second">
								<InputMask className="_input phone-second-input main-font" mask="999-9999" maskChar="_" placeholder="___-____" value={value.phone2} onChange={(e) => this.handleChange("phone2", e)} onBlur={(e) => this.handleBlur('phone', e)} />
								{touched.phone && validation.phone && <img className="_img" src="/images/ui-icon/check.svg" alt="check" />}
							</div>
						</div>
						<div className="validation-error">
							{touched.phone && !validation.phone && "Entered Phone is incorrect, please try again"}
						</div>
						<div className="contact-input">
							<input
								className="_input main-font"
								type="date"
								name="birthDate"
								value={value.birthDate}
								onChange={e => this.handleChange("birthDate", e)}
							/>
							{touched.birthDate && validation.birthDate && <img className="_img" src="/images/ui-icon/check.svg" alt="check" />}
						</div>
						<div className="bottom-box">
							<Button
								onClick={() => { this.onClickAddContact() }}
								className="add-contact"
								label={`${selectedContactId ? 'Update' : 'Add'}`}
								padding="12px 35px"
								disabled={!validation.name || !validation.email || !validation.address || !validation.phone}
							/>
						</div>
					</div>
				</Modal>

				<Modal title="Import Contacts" showModal={showImportModal === 0} closeModal={this.closeImportModal} width="310px">
					<div className="import-content" onClick={this.onClickBody}>
						<div className="import-contacts-content main-font" onClick={this.openSelectFile}>
							<span className="_label">{file === null && "Choose file ..."}{file !== null && file.name}</span>
							<span className="_plus">+</span>
							<input className="_input" type="file" ref={this.previewRef} onChange={this.changeFile} />
						</div>
						<div className="bottom-box">
							<Button
								onClick={() => { this.onClickImportContact() }}
								className="add-contact"
								label="Import"
								padding="12px 35px"
								disabled={file === null}
							/>
						</div>
						<div className="bottom-contact">
							Need help importing contacts? Please contact support for help!
						</div>
						<div className="contact-support" onClick={this.onClickSupport}>
							Contact Support
						</div>
					</div>
				</Modal>

				<ContentModal className="import-second" showModal={showImportModal === 1} closeModal={this.closeImportModal} width="1136px" padding="0px">
					<div className="modalHeader">
						<h2>Identify Fields</h2>
						<div className="closeBtn" onClick={this.closeImportModal} />
					</div>
					<div className="import-second-content">
						<div className="column-titles">
							<CheckBox label="Column Titles" handleCheckboxChange={this.toggleCheckbox} isChecked={isHaveTitles} />
						</div>
						<div className="import-table">
							{!isHaveTitles && <div className="header-select">
								{headerKey.length !== 0 && headerKey.map((e, i ) => {
									return (
										<Select
											className="select-column"
											options={optionContacts}
											onChange={e => this.onSelectFieldHeader(i, e)}
											placeholder="Select"
											isClearable={false}
											isSearchable={false}
											menuContainerStyle={{ zIndex: 1000 }}
											styles={selectStyles}
											components={{ DropdownIndicator }}
											key={i}
										/>
									)
								})}
							</div>}
							<div className={`header ${isHaveTitles ? 'have-title' : ''}`}>
								{headerKey.length !== 0 && headerKey.map((e, i ) => {
									return (
										<span className={`header-title ${i !== headerKey.length -1 ? 'border-right' : ''} ${e.key === "" ? 'empty' : ''}`} key={i}>{e.label}</span>
									)
								})}
							</div>
							<div className="import-body">
								{csvShowArray.length > 0 && csvShowArray.map((e, i) => {
									return (
										<div className="content-row" key={i}>
											{e.length > 0 && e.map((d, j) => {
												return(
													<div className={`content-column ${j !== e.length - 1 ? 'border-right' : ''} ${headerKey[j].value ?'active' : ''}`} key={j}>{d}</div>
												)
											})}
										</div>
									)
								})}
							</div>
						</div>
						<div className="action-buttons">
							<Button padding="8px 24px" label="Back" onClick={this.onClickImporBack} />
							<Button padding="8px 24px" label="Next" onClick={this.onClickImportNext} />
						</div>
					</div>
				</ContentModal>

				<Modal className="import-third" title="Finish Import" showModal={showImportModal === 2} closeModal={this.closeImportModal} width="450px">
					<div className="content">
						<div className="third-title">Find Duplicate Using:</div>
						<div className="third-content">
							<CheckBox label="Full Name" handleCheckboxChange={this.toggleNameCheck} isChecked={isFullNameCheck} />
							<CheckBox label="Email" handleCheckboxChange={this.toggleEmailCheck} isChecked={isEmailCheck} />
							<CheckBox label="Phone" handleCheckboxChange={this.togglePhoneCheck} isChecked={isPhoneCheck} />
						</div>
						<div className="action-buttons">
							<Button padding="8px 24px" label="Back" onClick={this.onClickImporBack} />
							<Button padding="8px 24px" label="Save" onClick={this.onClickSaveArray} />
						</div>
					</div>
				</Modal>

				<ContentModal showModal={deletingContact} closeModal={this.onClickCloseDeleteDialog}>
					<div className="delete-content">
						<div className="delete-title">Delete contact {deletingContact && deletingContact.fullName}?</div>
						<div className="delete-action">
							<Button inverse padding="8px 38px" label="Yes" onClick={this.onClickConfirmDelete} />
							<Button padding="8px 28px" label="Cancel" onClick={this.onClickCloseDeleteDialog} />
						</div>
					</div>
				</ContentModal>

				<ContactDetailModal
					contactDetail={contactDetail}
					contactDetailInfo={contactDetailInfo}
					showContactDetailModal={showContactDetailModal}
					closeContactDetailModal={this.onClickCloseContactInfo}
				/>
			</section>
		)
	}
}


const mapStateToProps = state => ({
	userId: state.authentication.userId,
	contacts: state.contact.contacts,
	totCount: state.contact.totCount,
	contactDetail: state.contact.contactDetail
})

const mapDispatchToProps = {
	createContact,
	getContacts,
	clearContacts,
	editContact,
	deleteContact,
	uploadContactList,
	toggleNotification,
	getContactDetail,
	sendInviteContact
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Contact)