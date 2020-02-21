import { put, takeLatest, call } from 'redux-saga/effects';
import axios from '../helpers/axiosApi';
import getErrorText from '../helpers/serverErrors';

import {
	GET_SCHOOLS,
	SET_SCHOOLS,
	GET_SINGLE_SCHOOL,
	SET_SINGLE_SCHOOL,
	GET_INTERESTS,
	SET_INTERESTS,
	GET_CATEGORIES,
	SET_CATEGORIES,
	NOTIFICATION_TOGGLE,
	GET_NOTIFICATION_LIST,
	SET_NOTIFICATION_LIST,
	UPDATE_NOTIFICATION,
	READ_NOTIFICATION_LIST,
	GET_HIERARCHY_INTERESTS,
	SET_HIERARCHY_INTERESTS
} from '../actions/types';

import { store } from '../store';

function* getSchools() {
	try {
		let schools = yield call(axios.get, `/schools`)

		yield put({
			type: SET_SCHOOLS,
			schools: schools.data
		})
	} catch (error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {
	}
}

function* getSingleSchool({ singleSchool, skip }) {
	try {
		let school = yield call(
			axios.get,
			`/schools/${singleSchool}?skip=${skip}`
		)

		yield put({
			type: SET_SINGLE_SCHOOL,
			singleSchool: school.data,
			skip
		})
	} catch (error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {
	}
}

function* getAllInterests({data}) {
	try {
		let skip = (data && data.skip) ? data.skip : 0;
		let limit= (data && data.limit) ? data.limit : 10000;
		let parentId = (data && data.parentId) ? `&parentId=${data.parentId}` : ''
		
		let interests = yield call(axios.get, `/interests?skip=${skip}&limit=${limit}${parentId}`);

		yield put({
			type: SET_INTERESTS,
			interests: interests.data
		})
	} catch (error) {
		let notifyData = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...notifyData,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {
	}
}

function* getHierarchyInterests({data}) {
	try {
		let skip = (data && data.skip) ? data.skip : 0;
		let limit= (data && data.limit) ? data.limit : 10000;
		let parentId = (data && data.parentId) ? `&parentId=${data.parentId}` : '';
		let level = (data && !data.parentId) ? `&level=0` : '';
		
		let interests = yield call(axios.get, `/interests/hierarchy?skip=${skip}&limit=${limit}${parentId}${level}`);

		yield put({
			type: SET_HIERARCHY_INTERESTS,
			interests: interests.data
		})
	} catch (error) {
		let notifyData = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...notifyData,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {
	}
}

function* getNotifications() {
	try{
		let res = yield call(axios.get, `/notification`)
		yield put({
			type: SET_NOTIFICATION_LIST,
			pendings: res.data.pendings,
			notifications: res.data.notifications,
			unreadNotify: res.data.unreadNotify
		})
	} catch(error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {

	}
}

function* updateNotification({ data }) {
	let {
		pendingFriends
	} = store.getState().globalReducer
	try {
		yield call(axios.patch, `/notification/${data._id}`, data);
		let res = yield call(axios.get, `/notification`);
		let notifications = res.data.notifications;
		
		let newUnreadNotify = notifications.filter(element => !element.isRead).length;
		
		yield put({
			type: SET_NOTIFICATION_LIST,
			notifications: notifications,
			// notifications: notifications.filter((e) => {
			// 	if (e._id !== data._id)
			// 		return true;
			// 	else
			// 		return false;
			// }),
			pendings: pendingFriends,
			unreadNotify: newUnreadNotify
		})
	}  catch(error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {

	}
}

function* readNotificationList() {
	let {
		notifications, pendingFriends
	} = store.getState().globalReducer
	try {
		yield call(axios.get, `/notification/read`)
		yield put({
			type: SET_NOTIFICATION_LIST,
			notifications: notifications.map((e) => {
				e.isRead = true
				return e
			}),
			pendings: pendingFriends,
			unreadNotify: 0
		})
	} catch(error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {

	}
}

function* getAllCategories() {
	try {
		let categories = yield call(axios.get, `/interests/categories`)

		yield put({
			type: SET_CATEGORIES,
			categories: categories.data
		})
	} catch (error) {
		let data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	} finally {
	}
}

export function* globalInfo() {
	yield takeLatest(GET_SINGLE_SCHOOL, getSingleSchool)
	yield takeLatest(GET_SCHOOLS, getSchools)
	yield takeLatest(GET_INTERESTS, getAllInterests)
	yield takeLatest(GET_CATEGORIES, getAllCategories)
	yield takeLatest(GET_NOTIFICATION_LIST, getNotifications)
	yield takeLatest(UPDATE_NOTIFICATION, updateNotification)
	yield takeLatest(READ_NOTIFICATION_LIST, readNotificationList)
	yield takeLatest(GET_HIERARCHY_INTERESTS, getHierarchyInterests)
}
