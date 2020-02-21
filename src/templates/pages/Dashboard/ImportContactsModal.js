import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
//import csv from 'csv'
import { toggleNotification } from '../../../actions/notificationActions'
import {
	// uploadContactList
	uploadContactCsv
} from '../../../actions/contact'

class ImportContactsModal extends Component {

	constructor(props){
		super(props)
		this.previewRef = React.createRef()
	}

	state = {
		file: null
	}

	openSelectFile = (e) => {
		e.stopPropagation();
		this.previewRef.current.click()
	}

	changeFile = e => {
		if(e.target.files.length === 0)
            return;
		if (
			e.target.files[0].name.indexOf('.csv') === -1 && e.target.files[0].name.indexOf('.xls') === -1
			&& e.target.files[0].name.indexOf('.xlsx') === -1
		) {
			this.props.toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload CSV or excel files',
					buttonText: 'Ok'
				})
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.setState({ file: e.target.files[0] })
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

	onClickImportContact = () => {
		// const reader = new FileReader();
		// reader.onload = () => {
		// 	csv.parse(reader.result, (err, data) => {
		// 		let csvContactArray = []
		// 		let csvShowArray = []
		// 		data.forEach(d => {
		// 			const con = {
		// 				field1: {
		// 					value: d[0],
		// 					//key: 'fullName'
		// 				},
		// 				field2: {
		// 					value: d[1],
		// 					//key: 'email'
		// 				},
		// 				field3: {
		// 					value: d[2],
		// 					//key: 'address'
		// 				},
		// 				field4: {
		// 					value: d[3],
		// 					//key: 'phone'
		// 				}
		// 			}
		// 			csvContactArray.push(JSON.parse(JSON.stringify(con)))
		// 			csvShowArray.push(JSON.parse(JSON.stringify(con)))
		// 		})
		// 		this.setState({showImportModal: 1, csvContactArray: csvContactArray , csvShowArray: csvShowArray, isHaveTitles: false})
		// 	});
		// };
		// reader.readAsBinaryString(this.state.file);
		let data = {
			file: this.state.file,
			cb : () =>{
				this.props.closeModal()
			}
		}
		this.props.uploadContactCsv(data)
	}


	closeModal = (e) => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.props.closeModal()
		}
	}

	render() {
		const {
			file
		} = this.state

		return(
			<Modal title="Import Contacts" showModal={this.props.showModal} closeModal={this.closeModal}>
				<div className="import-content">
					<div className="import-contacts-content main-font" onClick={this.openSelectFile}>
						<span className="_label">{file === null && "Choose file ..."}{file !== null && file.name}</span>
						<span className="_plus">+</span>
						<input className="_input" type="file" ref={this.previewRef} onChange={this.changeFile}/>
					</div>
					<div className="bottom-box">
					<Button
						onClick={() =>{this.onClickImportContact()}}
						className="add-contact"
						label="Import"
						padding="12px 35px"
						disabled = {file === null}
					/>
					</div>
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	
})


const mapDispatchToProps = {
	toggleNotification,
	uploadContactCsv
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ImportContactsModal)