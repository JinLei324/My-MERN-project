import React, { Component } from 'react';

class Modal extends Component {

	state = {
	}

	componentWillReceiveProps(newProps) {
		// if (newProps.showModal) {
		// 	document.body.classList.add(`modal-open-${newProps.className}`)
		// } else {
		// 	document.body.classList.remove(`modal-open-${this.props.className}`)	
		// }
	}
	
	render() {
		let { className, width, title, showModal, closeModal, padding } = this.props
		if (!width)
			width = '400px'
		if (!padding)
			padding = "20px"

		return (
			<div
				className={`${className ||
					''} modal ${showModal ? 'open' : ''}`}
				onClick={closeModal}>
				<div className={`${className ||
					''} modalContent`} style={{ maxWidth: width, padding }} onClick={(e) => {e.stopPropagation()}}>
					<div className="modalHeader">
						{title && title !== '' && <h2>{title}</h2>}
						<div className="closeBtn" onClick={closeModal} />
					</div>
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default Modal