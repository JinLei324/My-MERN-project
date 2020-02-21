import React, {Component} from 'react'
import Modal from '../../common/Modal'
import { connect } from 'react-redux'

class VerificationModal extends Component {

    state = {
        passcode: ""
    }

    passcodeChange = e => {
        this.setState({ [e.target.name]: e.target.value }, () => {
            if (this.state.passcode.length === 7) {
                this.props.onClaim(this.state.passcode)
            }
        });
    }

    componentDidMount() {
    }

    render() {
        const {
            passcode
        } = this.state;

        const {
			showModal,
            closeModal,
            onSupport
        } = this.props;
        
        return(
            <Modal showModal={showModal} width="300px" padding="30px 30px" closeModal={closeModal}>
                <div className="claim-wizard-content">
                    <img className="m-b-10" src="/images/ui-icon/profile/user.svg" alt="user" />
                    <span className="m-b-10 text-center claim-desc">To claim your profile please enter the passcode that was sent to your organizations email, or please conact support for help!</span>
                    <input className="m-b-10 passcode" placeholder="Passcode...." value={passcode} name='passcode' onChange={this.passcodeChange}/>
                    <div className="btn-contact"  onClick={onSupport}>Contact Support</div>
                </div>
            </Modal>
        )
    }
}

export default connect()(VerificationModal)