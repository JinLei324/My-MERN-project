import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { withdrawAmount } from '../../../actions/user';
import { toggleNotification } from '../../../actions/notificationActions';

class WithdrawModal extends Component {

    state = {
        withdrawalAmount: 0
    }

    componentWillReceiveProps(newProps) {
		if (newProps.modalType) {
			document.body.classList.add(`modal-open-${newProps.modalType}`);
		} else {
			document.body.classList.remove(`modal-open-${this.props.modalType}`);
		}
    }

    closeModal = (e) => {
		if (e.target.className && (
                ( e.target.className.includes('modal') && e.target.className.includes('open') ) || e.target.className.includes('closeBtn')
            )) {
			this.props.closeModal();
		}
	}

    onClickGeneralDonation = e => {
        e.preventDefault();
		e.stopPropagation();
    }

    inputChange = e => {
        e.preventDefault();
        e.stopPropagation();
        
        this.setState({ [e.target.name]: e.target.value });
    }

    withdraw = e => {
		e.preventDefault();
		e.stopPropagation();

		let { withdrawalAmount } = this.state;
		if (withdrawalAmount === 0) {
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Error',
				secondTitle: 'Invalid withdrawal amount',
				buttonText: 'Ok'
			});
			return;
		}

		this.props.withdrawAmount({ amount: withdrawalAmount });
	}
    
    render() {
        let { withdrawalAmount } = this.state;
        const { totalDonation } = this.props;

        return (
            <Modal title="" showModal={this.props.showModal} closeModal={this.closeModal}>
                <div className="panel-body fixed-width withdrawalCard">
                    {/* <span className="center action-picture">
                        <FontAwesomeIcon icon="ellipsis-h"/>
                    </span> */}
                    <div className="center separator-20" />
                    <div className='outer'>
                        <div className='leftPanel'>
                            <p>General Donations</p>
                            <img src="/images/ui-icon/icon-money.svg" alt="Money Icon" onClick={this.onClickGeneralDonation}/>
                            <div className="center available-donation-money">${totalDonation}</div>
                        </div>
                        <div className='rightPanel'>
                            <div className="center available-donation-money">${totalDonation}</div>
                            <div className="center available-donation">Available</div>
                            <input className='withdrawalAmount'
                                type="number" name="withdrawalAmount" 
                                value={withdrawalAmount} onChange={this.inputChange}
                            />
                            <div className="center withdrawal-amount">Withdrawal Amount</div>
                        </div>
                    </div>
                    <Button className="accept-button withdrawBtn" label="Withdraw" onClick={this.withdraw} />
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => ({
	user: state.authentication.user
});

const mapDispatchToProps = {
	withdrawAmount,
	toggleNotification
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WithdrawModal)