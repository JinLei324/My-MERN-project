import React, { Component } from 'react';

import ForgotPass from '../../common/authModals/modalWindows/forgotPass';
import NewPassword from '../../common/authModals/modalWindows/newPass';
import SignIn from '../../common/authModals/modalWindows/signIn';
import SignUp from '../../common/authModals/modalWindows/signUp';
import NewNonprofit from '../../common/authModals/modalWindows/newNonprofit';
import NewStudent from '../../common/authModals/modalWindows/newStudent';
import NewDonor from '../../common/authModals/modalWindows/newDonor';

import LayoutModal from './components/layoutModal';
import {
	forgotPassword,
	newPassword,
	signIn,
	signUp,
	newNonprofit,
	newStudent,
	newDonor
} from './modalTypes';

import { withRouter } from 'react-router'
import { connect } from 'react-redux'

class AuthModal extends Component {

	componentWillReceiveProps(newProps) {
		if (newProps.modalType) {
			document.body.classList.add(`modal-open-${newProps.modalType}`)
		} else {
			document.body.classList.remove(`modal-open-${this.props.modalType}`)
		}
	}
	render() {
		const { modalType, handleClose, changeTypeId, passwordFailed } = this.props
		
		return (
			<div>
				<div className="AuthModal">
					{ modalType === signIn && (
						<SignIn
							handleClose={handleClose}
							changeTypeId={changeTypeId}
							failedCount = {passwordFailed}
						/>
					) }
					{ modalType === signUp && (
						<SignUp
							handleClose={handleClose}
							changeTypeId={changeTypeId}
						/>
					) }
					{ modalType === forgotPassword && (
						<ForgotPass
							changeTypeId={changeTypeId}
							handleClose={handleClose}
						/>
					) }
					{ modalType === newPassword && (
						<NewPassword
							changeTypeId={changeTypeId}
							handleClose={handleClose}
						/>
					) }
					{ modalType === newStudent && (
						<NewStudent handleClose={handleClose} />
					) }
					{ modalType === newNonprofit && (
						<NewNonprofit handleClose={handleClose} />
					) }
					{ modalType === newDonor && (
						<NewDonor handleClose={handleClose} />
					) }
				</div>
				<div className="tr-footer"/>
			</div>
		)
	}
}

const mapStateToProps = ({ globalReducer, authentication }) => ({
	schools: globalReducer.schools,
	passwordFailed: authentication.passwordFailed
})

export default withRouter(connect(mapStateToProps)(LayoutModal(AuthModal)))
