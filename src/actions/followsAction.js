import {
	GET_USER_FOLLOWERS,
	GET_USER_INFORMATION,
	GET_USER_FOLLOWINGS,
	FOLLOW_USER_START,
	UNFOLLOW_USER,
	UNFOLLOW_USER_START,
	FOLLOW_USER,
	GET_USER_PROFILE,
	CLEAR_FOLLOW_LIST,
	UPDATE_FOLLOW_STATUS
} from './types'

export const getUserFollowers = (userID, page) => ({
	type: GET_USER_FOLLOWERS,
	userID,
	page
})

export const getUserFollowings = (userID, page) => ({
	type: GET_USER_FOLLOWINGS,
	userID,
	page
})

export const getUserProfile = userID => ({
	type: GET_USER_PROFILE,
	userID
})

export const followThisUser = userID => ({
	type: FOLLOW_USER_START,
	userID
})

export const unfollowThisUser = userID => ({
	type: UNFOLLOW_USER_START,
	userID
})

export const setUserInformation = user => ({
	type: GET_USER_INFORMATION,
	payload: user
})

export const unfollowingUser = (myID, followID) => ({
	type: UNFOLLOW_USER,
	payload: { myID, followID }
})

export const followingUser = (myID, followID) => ({
	type: FOLLOW_USER,
	payload: { myID, followID }
})

export const clearListFollow = clear => ({
	type: CLEAR_FOLLOW_LIST,
	payload: { clear }
})

export const updateFollowStatus = data => ({
	type: UPDATE_FOLLOW_STATUS,
	data
})