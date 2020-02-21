import React, {Component} from 'react'
import Modal from '../index.js';
import Button from '../../Button/index.js';

export default class ConfirmModal extends Component {
    render() {
        let { className, width, title, showModal, closeModal, padding, onClickYes, onClickNo } = this.props
        return (
            <Modal className={className} title={title} showModal={showModal} closeModal={closeModal} padding={padding} width={width} >
                <div className="confirm-modal-content">
                    <Button fontSize="14px" solid noBorder label="Yes" padding="4px 18px" onClick={onClickYes}/>
                    <Button fontSize="14px" inverse label="No" padding="4px 20px" onClick={onClickNo}/>
                </div>
            </Modal>
        )
    }
}