import React from 'react'

const LayoutNotificationModal = WrappedComponent => {
	let submitForm = e => {
		e.preventDefault()
	}

	return props => (
		<div
			className={`LayoutNotificationModal${
				props.showModal ? ' open' : ''
			}`}
			onClick={props.close}>
			<form
				autoComplete="off"
				className="wrapperForForm"
				onSubmit={submitForm}>
				<WrappedComponent {...props} />
			</form>
		</div>
	)
}

export default LayoutNotificationModal
