import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import {
	GET_USER_PROFILE,
	GET_USER_INFORMATION,
	NOTIFICATION_TOGGLE,
	GET_USER_FOLLOWERS,
	SET_USER_FOLLOWERS,
	SET_USER_FOLLOWINGS,
	GET_USER_FOLLOWINGS,
	FOLLOW_USER_START,
	FOLLOW_USER,
	UNFOLLOW_USER_START,
	FOLLOW_AUTH_USER,
	UNFOLLOW_USER,
	PRELOADER_TOGGLE,
	UPDATE_FOLLOW_STATUS,
	SET_NOTIFICATION_LIST
} from '../actions/types'
import { store } from '../store'
import { ACCEPT } from '../helpers/followStatus';

function errorHandler(error) {
	return {
		type: NOTIFICATION_TOGGLE,
		payload: {
			isOpen: true,
			resend: false,
			firstTitle: 'Error',
			secondTitle: getErrorText(error),
			buttonText: 'Ok'
		}
	}
}

function* getUserProfile({ userID }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getUserProfile' }
		})
		let res = yield call(axios.get, `/user/${userID}`)
		yield put({
			type: GET_USER_INFORMATION,
			payload: res.data.user
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getUserProfile' }
		})
	}
}

function* getUserFollowers({ userID, page }) {
	let { skip } = page
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getUserFollowers' }
		})
		let res = yield call(
			axios.get,
			`/user/${userID}/followers?&limit=10&${
				skip > 0 ? `skip=${skip}` : ''
			}`
		)
		yield put({
			type: SET_USER_FOLLOWERS,
			payload: res.data,
			page
		})
	} catch (error) {
		yield put(yield put(errorHandler(error)))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getUserFollowers' }
		})
	}
}

function* getUserFollowings({ userID, page }) {
	let { skip } = page

	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getUserFollowings' }
		})
		let res = yield call(
			axios.get,
			`/user/${userID}/followings?&limit=10&${
				skip > 0 ? `skip=${skip}` : ''
			}`
		)
		yield put({
			type: SET_USER_FOLLOWINGS,
			payload: res.data,
			page
		})
	} catch (error) {
		yield put(yield put(errorHandler(error)))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getUserFollowings' }
		})
	}
}

function* followThisUser({ userID }) {
	try {
		let { userId } = store.getState().authentication
		let res = yield call(axios.post, `/user/${userID}/followings`)
		yield put({
			type: FOLLOW_USER,
			payload: { myID: userId, followID: userID, status: res.data.status }
		})
		if(res.data.status === ACCEPT) {			
			yield put({
				type: FOLLOW_AUTH_USER,
				payload: true
			})
		}
	} catch (error) {
		yield put(yield put(errorHandler(error)))
	}
}

function* unfollowThisUser({ userID }) {
	try {
		let res = yield call(axios.delete, `/user/${userID}/followings`)
		let { userId } = store.getState().authentication
		yield put({
			type: UNFOLLOW_USER,
			payload: { myID: userId, followID: userID, status: res.data.status }
		})
		if(res.data.status === ACCEPT) {
			
			yield put({
				type: FOLLOW_AUTH_USER,
				payload: false
			})
		}
	} catch (error) {
		yield put(yield put(errorHandler(error)))
	}
}

function* updateFollowStatus({data}) {
	let {
		pendingFriends, notifications
	} = store.getState().globalReducer
	try{
		yield call(axios.patch, `/follow/${data._id}`, data)
		yield put({
			type: SET_NOTIFICATION_LIST,
			notifications: notifications,
			pendings: pendingFriends.filter((e) => {
				if (e._id !== data._id)
					return true;
				return false;
			})
		})
	} catch(error) {
		yield put(errorHandler(error))
	}
}

export function* follows() {
	yield takeLatest(GET_USER_PROFILE, getUserProfile)
	yield takeLatest(GET_USER_FOLLOWERS, getUserFollowers)
	yield takeLatest(GET_USER_FOLLOWINGS, getUserFollowings)
	yield takeLatest(FOLLOW_USER_START, followThisUser)
	yield takeLatest(UNFOLLOW_USER_START, unfollowThisUser)
	yield takeLatest(UPDATE_FOLLOW_STATUS, updateFollowStatus)
}
