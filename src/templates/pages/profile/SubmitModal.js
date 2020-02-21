import React, {Component} from 'react'
import { connect } from 'react-redux'
import Modal from '../../common/Modal'
import Button from '../../common/Button'
import InputFile from '../../common/InputFile'
import { PENDING } from '../../../helpers/userStatus'
import {
	submitApproveDocument
} from '../../../actions/user'

class SubmitModal extends Component {
	state = {
		file: null,
		showError: false
	}

	setUploadFile = (files) => {
		if (files)
			this.setState({ file: files[0], showError: false })
		else
			this.setState({ file: null, showError: false })
	}


	submitDocument = e => {
		this.props.submitApproveDocument(e)
		this.setState({ showSubmitModal: false })
	}

	onSubmit = e => {
		e.preventDefault()
		if (this.state.file === null) {
			this.setState({ showError: true })
		}
		else {
			let file = this.state.file
			this.props.submitApproveDocument({ file })
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user && nextProps.user.status === PENDING) {
			this.setState({ file: null, showError: false }, () => {
				this.inputfile.clear()
				this.props.afterSubmit()
			})
		}
	}

	render() {
		const {
			showModal,
			closeModal,
		} = this.props
	
		const {
			showError
		} = this.state

		return (
			<Modal title="Upload verificationDocument" showModal={showModal} closeModal={closeModal}>
				<form className="submitDocumentForm" onSubmit={this.onSubmit}>
					<div className="form-group">
						<InputFile onChange={this.setUploadFile} onRef={ref => (this.inputfile = ref)} accept=".rar,application/x-zip-compressed,application/pdf" />
						<span className={`globalErrorHandler ${showError ? 'show' : ''}`}>You should select file.</span>
					</div>
					<div className="form-group">
						<Button
							className="uploadDocument"
							label="Upload"
						/>
					</div>
				</form>
			</Modal>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user
})

const mapDispatchToProps = {
	submitApproveDocument
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SubmitModal)