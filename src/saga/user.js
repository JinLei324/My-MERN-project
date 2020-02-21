import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import { CANCELLED } from '../helpers/userStatus'
import { store } from '../store'

import {
	SEND_USER_SUBSCRIBE,
	SEND_USER_CONTACT,
	SET_USER_SUBSCRIBE,
	SET_USER_CONTACT,
	NOTIFICATION_TOGGLE,
	CANCEL_VERIFICATION,
	SHOWN_APPROVE_MESSAGE,
	UPDATE_USER_STATUS,
	HIDE_APPROVE_MESSAGE,
	UPLOAD_PROFILE_PICTURE,
	SET_USER_PROFILE_PICTURE,
	DELETE_PROFILE_PICTURE,
	GET_USER_LIST,
	SET_USER_LIST,
	SET_DONOR_AVATAR,
	UPDATE_DONOR_AVATAR,
	UPDATE_FIRST_TIME,
	GET_STRIPE_ACCOUNT_INFO,
	SET_STRIPE_CONNECT_RESULT,
	SUBMIT_REVIEW_PROFILE,
	SET_REVIEW_LIST,
	GET_REIVEW_LIST,
	UPDATE_USER_RATING,
	GET_DONOR_GIVE_INFO,
	SET_DONOR_GIVE_INFO,
	INVITE_NONPROFIT,
	PAYOUT_STRIPE,
	SET_IS_CLAIMED,
	WITHDRAW_AMOUNT,
	GET_COMMUNITY_LIST,
	SET_COMMUNITY_LIST
} from '../actions/types'

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

function successDialog(title) {
	return {
		type: NOTIFICATION_TOGGLE,
		payload: {
			isOpen: true,
			resend: false,
			buttonText: 'Ok',
			firstTitle: "Success",
			secondTitle: title
		}
	}
}

function* sendUserSubscribe(data) {
	try {
		let subscribe = yield call(axios.post, '/email-subscribe', data)

		yield put({
			type: SET_USER_SUBSCRIBE,
			userSubscribe: {
				status: "success",
				message: subscribe
			}
		})
	} catch (error) {
		yield put({
			type: SET_USER_SUBSCRIBE,
			userSubscribe: {
				status: "error",
				message: error.message
			}
		})
	} finally {

	}
}

function* sendUserContact(data) {
	try {
		yield call(axios.post, '/sendContact', data)
		yield put({
			type: SET_USER_CONTACT,
			userContact: {
				status: "success"
			}
		})
	} catch (error) {
		yield put(errorHandler(error))
		yield put({
			type: SET_USER_CONTACT,
			userContact: {
				status: "error"
			}
		})
	} finally {
	}
}

function* cancelVerification() {
	try {
		yield call(axios.get, `/user/cancelVerification`)
		yield put({
			type: UPDATE_USER_STATUS,
			status: CANCELLED
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* shownApproveMessage() {
	try {
		yield call(axios.get, `/user/shownApproveMessage`)
		yield put({
			type: HIDE_APPROVE_MESSAGE
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* uploadProfilePicture(data) {
	let { file } = data
	delete data.file
	try {
		const formData = new FormData()
		formData.append('profilePicture', file)

		let res = yield call(axios.post, `/user/picture`, formData, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		})
		yield put({
			type: SET_USER_PROFILE_PICTURE,
			picture: res.data.path
		})

	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* deleteProfilePicture() {
	try {
		yield call(axios.post, '/user/deletePicture');
		yield put({
			type: SET_USER_PROFILE_PICTURE,
			picture: ''
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getUserList({data}) {
	let {
		userList
	} = store.getState().user
	try {
		let role = data.role ? `&role=${data.role}`:'';
		let companyName = data.companyName ? `&companyName=${data.companyName}`:'';
		let location = data.location ? `&location=${data.location}`:'';
		let isWeLove = data.isWeLove ? `&isWeLove=${data.isWeLove}`:'';
		let interests = data.interests && data.interests.length > 0 ? `&interests=${data.interests.join()}` : '';
		let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : '';
		let res = yield call(
			axios.get,
			`/user/nonprofit?skip=${data.skip}&limit=${data.limit}&${role}&${companyName}${isWeLove}${location}${interests}${sortBy}${sortDirection}`
		);
		
		let userArray = [];
		if (!data.type) {
			if (data.skip !== 0) {
				userArray = [...userList];
			}

			res.data.forEach(e => {
				if (userArray.findIndex(i => i._id === e._id) === -1) {
					userArray.push(e);
				}
			})
		} else if (data.type === 'all') {
			userArray = [...res.data];
		}		
		
		yield put({type: SET_USER_LIST, userList: userArray})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* setDonorAvatar({data}) {
	try{
		yield call(axios.post, `/user/${data._id}/donorAvatar`, data);		
		yield put({type: UPDATE_DONOR_AVATAR, avatar: data.donorAvatar})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* updateFirstTime() {
	try{
		yield call(axios.get, `/user/updateFirstTime`);
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getStripeAccountInfo ({data}) {//connect stripe account
	try{
		const res = yield call(axios.post, `/user/stripe-connect`, data)
		let resStatus = 1

		if(res.data.error) {
			resStatus = 1
		} else {
			resStatus = 2
		}
		yield put({type: SET_STRIPE_CONNECT_RESULT, status: resStatus})
	} catch(error) {
		yield put(errorHandler(error))
	}
}

function* submitReview({data}) {
	let {
		reviewList
	} = store.getState().user
	try{
		const res = yield call(axios.post, `/review`, data)
		let reviewArray = []
		reviewArray = [...reviewList]
		reviewArray.unshift(res.data)
		
		yield put({
			type: SET_REVIEW_LIST,
			reviews: [...reviewArray]
		})

		const newRating = ((data.currentRating * (reviewArray.length - 1) ) + res.data.rating )/ reviewArray.length
		yield put({
			type: UPDATE_USER_RATING,
			rating: newRating
		})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb()
	}
}

function* getReviews({data}) {
	try{
		let res = yield call(axios.get, `/review?userId=${data.userId}`)
		yield put({
			type: SET_REVIEW_LIST,
			reviews: res.data
		})
	} catch(error){
		yield put(errorHandler(error))
	} finally {

	}
}

function* getDonorGiveInfo({data}) {
	try {
		let res = yield call(axios.get, `/user/${data._id}/donor_info?userId=${data.userId}`)
		yield put({
			type: SET_DONOR_GIVE_INFO,
			donorGiveInfo: res.data
		})
	} catch(error){
		yield put(errorHandler(error))
	} finally {

	}
}

function* inviteNonprofit({inviteName}) {
	try {
		yield call(axios.post, `/user/invite`, {
			inviteName: inviteName
		})
		yield put(successDialog("Invitation has been sent"))
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* payoutStripe({data}) {
	let res
	try {
		res = yield call(axios.post, `/user/payout`, data)
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb(res.data)
	}
}

function* setIsClaimed({ data }) {
	let res
	try {
		res = yield call(axios.post, `/user/${data.userId}/claim`, data)
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb(res.data)
	}
}

function* withdrawAmount({ data }) {
	try {
		yield call(axios.post, `/give/payout`, {
			amount: data.amount
		})
		yield put(successDialog("Withdrawal succeed"))
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getCommunityList({data}) {
	// let {
	// 	communityList
	// } = store.getState().user;
	try {
		let interests = data.interests && data.interests.length > 0 ? `&interests=${data.interests.join()}` : '';
		let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : '';
		let res = yield call(
			axios.get,
			`/communities?skip=${data.skip}&limit=${data.limit}&${interests}${sortBy}${sortDirection}`
		);

		let communityArray = [];
		if (res && res.data && res.data.length === 1 && res.data[0].rows) {
			communityArray = [...res.data[0].rows];
		}
		
		yield put({type: SET_COMMUNITY_LIST, communityList: communityArray})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
	}
}

export function* user() {
	yield takeLatest(SEND_USER_SUBSCRIBE, sendUserSubscribe)
	yield takeLatest(SEND_USER_CONTACT, sendUserContact)
	yield takeLatest(CANCEL_VERIFICATION, cancelVerification)
	yield takeLatest(SHOWN_APPROVE_MESSAGE, shownApproveMessage)
	yield takeLatest(UPLOAD_PROFILE_PICTURE, uploadProfilePicture)
	yield takeLatest(DELETE_PROFILE_PICTURE, deleteProfilePicture)
	yield takeLatest(GET_USER_LIST, getUserList)
	yield takeLatest(SET_DONOR_AVATAR, setDonorAvatar)
	yield takeLatest(UPDATE_FIRST_TIME, updateFirstTime)
	yield takeLatest(GET_STRIPE_ACCOUNT_INFO, getStripeAccountInfo)
	yield takeLatest(SUBMIT_REVIEW_PROFILE, submitReview)
	yield takeLatest(GET_REIVEW_LIST, getReviews)
	yield takeLatest(GET_DONOR_GIVE_INFO, getDonorGiveInfo)
	yield takeLatest(INVITE_NONPROFIT, inviteNonprofit)
	yield takeLatest(PAYOUT_STRIPE, payoutStripe)
	yield takeLatest(SET_IS_CLAIMED, setIsClaimed)
	yield takeLatest(WITHDRAW_AMOUNT, withdrawAmount)
	yield takeLatest(GET_COMMUNITY_LIST, getCommunityList)
}
