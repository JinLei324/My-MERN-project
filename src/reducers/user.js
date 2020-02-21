import {
	SET_USER_SUBSCRIBE,
	SET_USER_CONTACT,
	CLEAR_USER_SUBSCRIBE,
	CLEAR_USER_CONTACT,
	SET_USER_LIST,
	CLEAR_USER_LIST,
	SET_STRIPE_CONNECT_RESULT,
	SET_REVIEW_LIST,
	CLEAR_REVIEW_LIST,
	SET_DONOR_GIVE_INFO,
	SET_VERIFY_STEP,
	SET_COMMUNITY_LIST,
	CLEAR_COMMUNITY_LIST
} from '../actions/types'

const initState = {
	userSubscribe: {
		status: "",
		message: ""
	},
	userContact: {
		status: ""
	},
	userList: [],
	stripeConnectResponse: -1,
	reviewList: [],
	donorGiveInfo: {},
	currentVerifyStep: 0,
}

export default function(state = initState, action) {

	if (SET_USER_SUBSCRIBE === action.type) {
		return {
			...state,
			userSubscribe: action.userSubscribe
		}
	}

	if (SET_USER_CONTACT === action.type) {
		return {
			...state,
			userContact: action.userContact
		}
	}

	if (CLEAR_USER_SUBSCRIBE === action.type) {
		return {
			...state,
			userSubscribe: {
				status: "",
				message: ""
			}
		}
	}

	if (CLEAR_USER_CONTACT === action.type) {
		return {
			...state,
			userContact: {
				status: ""
			}
		}
	}

	if (SET_USER_LIST === action.type) {
		return {
			...state,
			userList: action.userList
		}
	}

	if (CLEAR_USER_LIST === action.type) {
		return {
			...state,
			userList: []
		}
	}

	if (SET_STRIPE_CONNECT_RESULT === action.type) {
		return {
			...state,
			stripeConnectResponse: action.status
		}
	}
	if (SET_REVIEW_LIST === action.type) {
		return {
			...state,
			reviewList: action.reviews
		}
	}
	if (CLEAR_REVIEW_LIST === action.type) {
		return {
			...state,
			reviewList: []
		}
	}
	if (SET_DONOR_GIVE_INFO === action.type) {
		return {
			...state,
			donorGiveInfo: action.donorGiveInfo
		}
	}
	if (SET_VERIFY_STEP === action.type) {
		return {
			...state,
			currentVerifyStep: action.step
		}
	}

	if (SET_COMMUNITY_LIST === action.type) {
		return {
			...state,
			communityList: action.communityList
		}
	}

	if (CLEAR_COMMUNITY_LIST === action.type) {
		return {
			...state,
			communityLisst: []
		}
	}
			
	return state
}