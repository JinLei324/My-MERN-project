import {
	LOGIN,
	SUPER_LOGIN,
	CREATE_USER,
	LOGOUT_USER,
	SET_UP_AVATAR_TO_STORE,
	SET_UP_AVATAR_URL_TO_USER,
	GET_ME,
	FOLLOW_AUTH_USER,
	UPDATE_AUTH_NONPROFIT,
	UPDATE_AUTH_DONOR,
	UPDATE_AUTH_STUDENT,
	UPDATE_USER_STATUS,
	HIDE_APPROVE_MESSAGE,
	SET_USER_PROFILE_PICTURE,
	UPDATE_DONOR_AVATAR,
	NOTIFICATION_FOLLOW,
	NOTIFICATION_FOLLOWING,
	NOTIFICATION_UNFOLLOW,
	UPDATE_NONPROFIT_STATUS,
	CHECK_HINTS,
	LOGIN_FAILED,
	UNREAD_PROJECTS
} from '../actions/types'

const initialState = {
	isAuth: false,
	user: null,
	avatar: null,
	token: null,
	userId: null,
	passwordFailed: 5
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case SET_UP_AVATAR_URL_TO_USER:
			let stateWithAva = { ...state }
			stateWithAva.user.avatar = action.payload
			return stateWithAva
		case SET_USER_PROFILE_PICTURE:
			let st = { ...state }
			st.user.profilePicture = action.picture
			return st
		case SET_UP_AVATAR_TO_STORE:
			return {
				...state,
				avatar: action.payload
			}
		case GET_ME:
			return {
				...state,
				user: action.payload
			}
		case LOGIN:
			let obj = {
				...state,
				user: action.payload.user,
				userId: action.payload.user._id,
				token: action.token,
				isAuth: true,
				passwordFailed: 5
			}
			return obj
		case SUPER_LOGIN:
			let info = {
				...state,
				user: action.payload.user,
				userId: action.payload.user._id,
				token: action.token,
				isAuth: true,
				passwordFailed: 5
			}
			return info
		case LOGIN_FAILED:
			let passwordFailed = { ...state }.passwordFailed
			return {
				...state,
				passwordFailed: passwordFailed - 1
			}
		case FOLLOW_AUTH_USER:
			let newUser = { ...state }.user
			action.payload
				? (newUser.followingCount += 1)
				: (newUser.followingCount -= 1)
			return {
				...state,
				user: newUser
			}
		case NOTIFICATION_FOLLOW:
			newUser = { ...state }.user
			newUser.followingCount += 1
			return {
				...state,
				user: newUser
			}
		case NOTIFICATION_FOLLOWING:
			newUser = { ...state }.user
			newUser.followersCount += 1
			return {
				...state,
				user: newUser
			}
		case NOTIFICATION_UNFOLLOW:
			newUser = { ...state }.user
			newUser.followersCount -= 1
			return {
				...state,
				user: newUser
			}
		case CREATE_USER:
			return {
				...state,
				user: action.payload.user,
				userId: action.payload.user._id,
				token: action.token,
				isAuth: true
			}
		case LOGOUT_USER:
			return {
				...state,
				token: null,
				userId: null,
				isAuth: false,
				user: null
			}
		case UPDATE_AUTH_NONPROFIT:
			let newNonprofit = {
				...state.user,
				ein: action.payload.ein,
				billingAddress: action.payload.billingAddress,
				address: action.payload.address,
				companyName: action.payload.companyName
			}
			return {
				...state,
				user: newNonprofit
			}
		case UPDATE_AUTH_DONOR:
			let newDonor = {
				...state.user,
				firstName: action.payload.firstName,
				lastName: action.payload.lastName,
				birthday: action.payload.birthday,
				donorAddress: action.payload.donorAddress,
				aboutUs: action.payload.aboutUs
			}
			return {
				...state,
				user: newDonor
			}
		case UPDATE_AUTH_STUDENT:
			let newStudent = {
				...state.user,
				firstName: action.payload.firstName,
				lastName: action.payload.lastName,
				birthday: action.payload.birthday
			}
			return {
				...state,
				user: newStudent
			}

		case UPDATE_USER_STATUS:
			let _user = {
				...state.user,
				status: action.status
			}
			return {
				...state,
				user: _user
			}

		case HIDE_APPROVE_MESSAGE:
			_user = {
				...state.user,
				canShowStatusMessage: false
			}
			return {
				...state,
				user: _user
			}
		case UPDATE_DONOR_AVATAR:
			_user = {
				...state.user,
				donorAvatar: action.avatar
			}
			return {
				...state,
				user: _user
			}
		case UPDATE_NONPROFIT_STATUS:
			_user = {
				...state.user,
				...action.data
			}
			return {
				...state,
				user: _user
			}
		case CHECK_HINTS:
			let {hints} = state.user
			hints.push(action.hId)
			_user = {
				...state.user,
				hints: hints
			}
			return {
				...state,
				user:_user
			}
		case UNREAD_PROJECTS:
			_user = {
				...state.user,
				unreadVolunteers: action.volunteers,
				unreadDonations: action.donations,
				unreadPickups: action.pickups
			}
			return {
				...state,
				user:_user
			}
		default:
			return state
	}
}
