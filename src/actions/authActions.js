import {
	LOGOUT,
	SET_UP_AVATAR_TO_STORE,
	FORGOT_PASSWORD,
	RESET_PASSWORD_MODAL,
	GET_MY_PROFILE,
	REGISTER,
	LOGIN_START,
	CREATE_USER_START,
	NOTIFICATION_FOLLOW,
	NOTIFICATION_FOLLOWING,
	NOTIFICATION_UNFOLLOW,
	CHECK_HINTS,
	UNREAD_PROJECTS,
	SET_UNREAD_PROJECTS,
	SUPER_LOGIN_START
} from './types'

export const logout = () => ({
	type: LOGOUT
})

export const login = user => ({
	type: LOGIN_START,
	...user
})

export const trySuperLogin = user => ({
	type: SUPER_LOGIN_START,
	...user
})

export const createUser = user => ({
	type: CREATE_USER_START,
	...user
})

export const register = ({ email, password, role }) => ({
	type: REGISTER,
	email,
	password,
	role
})

export const forgotPasswordAction = ({ email }) => ({
	type: FORGOT_PASSWORD,
	email
})

export const passwordResetModal = ({ password, hash }) => ({
	type: RESET_PASSWORD_MODAL,
	password,
	hash
})

export const getMyProfile = () => ({
	type: GET_MY_PROFILE
})

export const setUpAvatarToStore = avatar => ({
	type: SET_UP_AVATAR_TO_STORE,
	payload: avatar
})

export const notificationFollow = () => ({
	type: NOTIFICATION_FOLLOW
})

export const notificationFollowing = () => ({
	type: NOTIFICATION_FOLLOWING
})

export const notificationUnFollow = () => ({
	type: NOTIFICATION_UNFOLLOW
})

export const checkHintId = hId => ({
	type: CHECK_HINTS,
	hId
})

export const unreadProjectsCount = (volunteers, donations, pickups) => ({
	type: UNREAD_PROJECTS,
	volunteers,
	donations,
	pickups
})

export const setUnreadProjectsCount = (projectType) => ({
	type: SET_UNREAD_PROJECTS,
	projectType
})