import React, { Component } from 'react'

export default class ModalHeader extends Component {
	render() {
		const { title, handleClose } = this.props
		return (
			<div className="modalHeader">
				<h2>{title}</h2>
				<div className="closeBtn" onClick={handleClose} />
			</div>
		)
	}
}
