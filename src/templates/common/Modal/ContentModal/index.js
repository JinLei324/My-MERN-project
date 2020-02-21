import React, { Component } from 'react'

class ContentModal extends Component {
	render() {
		let { className, width, showModal, closeModal, padding } = this.props
		if (!width)
			width = '400px'
		
		if(!padding)
			padding = "20px"
		
		return (
			<div
				className={`${className ||
					''} modal ${showModal ? 'open' : ''}`}
				onClick={closeModal}>
				<div className="modalContent" style={{ width, padding }} onClick={(e) => {e.stopPropagation()}}>					
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default ContentModal