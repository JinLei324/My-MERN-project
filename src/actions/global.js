import {
	GET_SCHOOLS,
	GET_SINGLE_SCHOOL,
	GET_INTERESTS,
	GET_CATEGORIES,
	GET_NOTIFICATION_LIST,
	UPDATE_NOTIFICATION,
	READ_NOTIFICATION_LIST,
	SET_UNREAD_NOTIFY,
	GET_HIERARCHY_INTERESTS
} from './types';

export const getSchools = schools => ({
	type: GET_SCHOOLS,
	schools
})

export const getAllCategories = () => ({ type: GET_CATEGORIES })

export const getAllInterests = data => ({
	type: GET_INTERESTS,
	data
})

export const getHierarchyInterests = data => ({
	type: GET_HIERARCHY_INTERESTS,
	data
})

export const getSingleSchool = (singleSchool, skip) => ({
	type: GET_SINGLE_SCHOOL,
	singleSchool,
	skip
})

export const getNotificationList = () => ({
	type: GET_NOTIFICATION_LIST
})

export const updateNotification = data => ({
	type: UPDATE_NOTIFICATION,
	data
})

export const readNotificationList = () => ({
	type: READ_NOTIFICATION_LIST
})

export const setUnreadNotifyCount = (data) => ({
	type: SET_UNREAD_NOTIFY,
	...data
})