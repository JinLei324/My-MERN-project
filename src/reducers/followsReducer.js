import {
	SET_USER_FOLLOWERS,
	SET_USER_FOLLOWINGS,
	GET_USER_INFORMATION,
	UNFOLLOW_USER,
	FOLLOW_USER,
	CLEAR_FOLLOW_LIST,
	UPDATE_USER_RATING
} from '../actions/types'
import { NONE, ACCEPT } from '../helpers/followStatus';

const initialState = {
	followers: [],
	followings: [],
	userInfo: {}
}

export default (state = initialState, action) => {
	if (action.type === CLEAR_FOLLOW_LIST) {
		return {
			...state,
			[action.payload.clear]: []
		}
	} else if (action.type === SET_USER_FOLLOWERS) {
		let followers
		action.page.skip === 0
			? (followers = [])
			: (followers = [...state.followers])
		action.payload.forEach(e => {
			if (!followers.find(user => user._id === e._id)) {
				followers.push(e)
			}
		})
		return { ...state, followers }
	} else if (action.type === SET_USER_FOLLOWINGS) {
		let followings
		action.page.skip === 0
			? (followings = [])
			: (followings = [...state.followings])
		action.payload.forEach(e => {
			if (!followings.find(user => user._id === e._id)) {
				followings.push(e)
			}
		})
		return { ...state, followings }
	} else if (action.type === GET_USER_INFORMATION) {
		let newState
		newState = {
			...state,
			userInfo: action.payload
		}

		return newState
	} else if (action.type === UNFOLLOW_USER) {
		let followings = state.followings.map(e => {
			if (e._id === action.payload.followID)
				return { ...e, isFollowing: false, followingStatus: NONE }
			else return { ...e }
		})

		let followers = state.followers.map(e => {
			if (e._id === action.payload.followID)
				return { ...e, isFollowing: false, followingStatus: NONE }
			else return { ...e }
		})

		let userInfo = { ...state.userInfo }
		if (action.payload.followID === userInfo._id) {
			userInfo.isFollowing = false
			userInfo.followingStatus = NONE
			if(action.payload.status === ACCEPT)
				userInfo.followersCount -= 1
		}

		return {
			...state,
			followings,
			followers,
			userInfo
		}
	} else if (action.type === FOLLOW_USER) {
		let followings = state.followings.map(e => {
			return e._id === action.payload.followID
				? { ...e, isFollowing: true, followingStatus: action.payload.status }
				: { ...e }
		})

		let followers = state.followers.map(e => {
			return e._id === action.payload.followID
				? { ...e, isFollowing: true, followingStatus: action.payload.status }
				: { ...e }
		})

		let userInfo = state.userInfo
		if (action.payload.followID === userInfo._id) {
			userInfo.isFollowing = true
			userInfo.followingStatus = action.payload.status
			if(userInfo.followingStatus === ACCEPT)
				userInfo.followersCount += 1
		}

		return {
			...state,
			followings,
			followers,
			userInfo
		}
	}  else if(action.type === UPDATE_USER_RATING) {
		let userInfo = state.userInfo
		userInfo.rating = action.rating
		return {
			...state,
			userInfo
		}
	}

	return state
}
