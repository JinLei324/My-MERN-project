import React, { Component } from 'react';

import Modal from '../../../common/Modal';

class InviteUI extends Component {

    state = {
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

    render() {
        const { showModal, closeModal, inviteChannels, clickInviteChannel } = this.props;

        return (
            <div className='invite-ui'>
                <Modal title='Invite friends' showModal={showModal} closeModal={closeModal}>
					<div className='panel-body'>
                        <ul>
                            { inviteChannels.map((elem, key) => {
                                return (
                                    <li key={elem.id}>
                                        <div className='each-channel' onClick={() => clickInviteChannel(elem.id)}>
                                            <img alt={elem.id} src={elem.image} />
                                            <p>{ elem.title }</p>
                                        </div>
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>
				</Modal>
            </div>
        )
    }

}

export default InviteUI 