import {
	CREATE_PROJECT,
	EDIT_PROJECT,
	GET_PROJECT_BY_ID,
	CLEAR_PROJECT,
	CONFIRM_OR_REJECT_NEED_PARTICIPATION,
	GET_PROJECTS,
	GET_ALL_PROJECTS,
	PROJECT_SUBSCRIPTION,
	CLEAR_PROJECTS_LIST,
	GET_NEED_PARTICIPATION_LIST,
	SET_NEED_PARTICIPATION_VALUE,
	REQUEST_NEED_DONATION,
	GET_REQUESTS,
	CLEAR_REQUESTS,
	GET_PROJECT_REQUESTS,
	CLEAR_PROJECT_REQUESTS,
	DONATE_MONEY,
	CLEAR_DONATE_ID,
	GET_DASHBOARD_DATA,
	CLEAR_DASHBOARD_DATA,
	SET_VOLUNTEER_ACTIVITY,
	UPDATE_VOLUNTEER_REQUEST,
	UPDATE_PICKUP_REQUEST,
	SEND_RECEIPT,
	TURNOFF_PROJECT,
	CANCEL_PROJECT
} from './types'

export const createProject = data => ({	type: CREATE_PROJECT, ...data })

export const getProjectById = id => ({ type: GET_PROJECT_BY_ID, id })

export const editProject = data => ({ type: EDIT_PROJECT, ...data })

export const getParticipationList = (data, skip) => ({ type: GET_NEED_PARTICIPATION_LIST, data, skip })

export const confirmOrRejectParticipation = data => ({ type: CONFIRM_OR_REJECT_NEED_PARTICIPATION, data })

export const setNeedParticipationValue = (data) => ({ type: SET_NEED_PARTICIPATION_VALUE, data })

export const requestNeedDonation = (data) => ({ type: REQUEST_NEED_DONATION, data })

export const clearProject = () => ({ type: CLEAR_PROJECT })

export const clearProjectsList = () => ({ type: CLEAR_PROJECTS_LIST })

export const getProjectByParams = data => ({ type: GET_PROJECTS, data })

export const getProjectSubscription = data => ({ type: PROJECT_SUBSCRIPTION, data })

export const getProjectList = data => ({ type: GET_ALL_PROJECTS, data })

export const getRequestsByParams = data => ({ type: GET_REQUESTS, data })

export const clearRequests = data => ({ type: CLEAR_REQUESTS })

export const getRequestsByProject = data => ({ type: GET_PROJECT_REQUESTS, data })

export const clearProjectRequests = data => ({ type: CLEAR_PROJECT_REQUESTS })

export const donateMoney = data => ({ type: DONATE_MONEY, data })

export const sendReceipt = data => ({ type: SEND_RECEIPT, data })

export const getDashboardData = () => ({ type: GET_DASHBOARD_DATA })

export const clearDashboardData = () => ({ type: CLEAR_DASHBOARD_DATA })

export const setVolunteerActivity = data => ({ type: SET_VOLUNTEER_ACTIVITY, data })

export const updateVolunteerRequest = data => ({ type: UPDATE_VOLUNTEER_REQUEST, data })

export const updatePickupRequest = data => ({ type: UPDATE_PICKUP_REQUEST, data })

export const clearDonateId = () => ({ type: CLEAR_DONATE_ID })

export const turnoffProject = data => ({ type: TURNOFF_PROJECT, ...data })

export const cancelProject = data => ({ type: CANCEL_PROJECT, ...data })