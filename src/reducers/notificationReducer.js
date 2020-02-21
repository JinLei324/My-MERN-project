import { NOTIFICATION_TOGGLE } from '../actions/types'

const initialState = {
	isOpen: false,
	resend: false,
	firstTitle: '',
	secondTitle: '',
	buttonText: ''
}

export default (state = initialState, action) => {
	switch (action.type) {
		case NOTIFICATION_TOGGLE:
			if (action.payload.isOpen === false) {
				return {
					...state,
					isOpen: action.payload.isOpen
				}
			}
			return {
				...state,
				isOpen: action.payload.isOpen,
				resend: action.payload.resend,
				firstTitle: action.payload.firstTitle,
				secondTitle: action.payload.secondTitle,
				buttonText: action.payload.buttonText
			}

		default:
			return state
	}
}
