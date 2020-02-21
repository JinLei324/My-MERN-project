import React, { Component } from 'react'

class ModalThankyouContact extends Component {
	render() {
		const { showThankyouContactModal, closeThankyouContactModal } = this.props

		return (
			<div
				className={`modalThankyouContact${showThankyouContactModal ? ' open' : ''}`}
				onClick={closeThankyouContactModal}>
				<div className="wrapper">
					<h1>
						Thank you
						<br />
						for contacting us!
					</h1>
					<button className={'closeX'} onClick={closeThankyouContactModal}>
						OK
					</button>
				</div>
			</div>
		)
	}
}

export default ModalThankyouContact