import { put, takeLatest, call } from 'redux-saga/effects'
import {
	SET_CURRENT_NEEDS_USERS,
	CREATE_PROJECT,
	SET_REQUEST_CRETE_PROJECT,
	GET_PROJECT_BY_ID,
	SET_ONLOAD_PROJECT,
	EDIT_PROJECT,
	GET_PROJECTS,
	SET_PROJECTS,
	GET_ALL_PROJECTS,
	SET_ALL_PROJECTS,
	PROJECT_SUBSCRIPTION,
	PRELOADER_TOGGLE,
	CONFIRM_OR_REJECT_NEED_PARTICIPATION,
	SET_CHANGES_NEED_APPLY,
	REQUEST_NEED_DONATION,
	UPDATE_NEED_PARTICIPATIONS,
	GET_NEED_PARTICIPATION_LIST,
	GET_REQUESTS,
	SET_REQUESTS,
	GET_PROJECT_REQUESTS,
	SET_PROJECT_REQUESTS,
	DONATE_MONEY,
	SET_DONATE_ID,
	SEND_RECEIPT,
	GET_DASHBOARD_DATA,
	SET_DASHBOARD_DATA,
	SET_VOLUNTEER_ACTIVITY,
	UPDATE_REQUEST_PARTICIPATION,
	UPDATE_VOLUNTEER_REQUEST,
	UPDATE_PICKUP_REQUEST,
	NOTIFICATION_TOGGLE,
	SET_GIVE_LIST,
	TURNOFF_PROJECT,
	CANCEL_PROJECT,
	SET_PROJECT_TURN_ON_OFF_STATUS,
	SET_PROJECT_CANCEL_RECOVER_STATUS
} from '../actions/types'
import { push } from 'react-router-redux'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import { getMyProfile } from '../actions/authActions'
import { getProjectById } from '../actions/project'
import { store } from '../store'
import { signIn } from '../templates/common/authModals/modalTypes'

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

export function* createProject(data) {
	yield put({ type: SET_REQUEST_CRETE_PROJECT, request: true });
	let { file } = data

	delete data.file
	delete data.type
	
	if (data.location) {
		data.location.geo.reverse()
	}

	try {
		const formData = new FormData()
		formData.append('cover', file)
		
		// commented for test purpose ...
		let res = yield call(axios.post, `project/cover`, formData, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}); console.log('project data : ' + JSON.stringify(data));
		res = yield call(axios.post, 'project', {
			...data,
			cover: res.data.path,
			coverThumb: res.data.thumbPath
		});

		yield put(push(`/${res.data.user}/project/${res.data._id}`))
		yield put(getMyProfile())
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({ type: SET_REQUEST_CRETE_PROJECT, request: false });
	}
}

function* loadProject({ id }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'loadProject' }
		})
		let resProject = yield call(axios.get, `/project/${id}`)

		let resUser = yield call(axios.get, `/user/${resProject.data.user._id}`)

		let participations = {}, needParticipation = {}
		if (resProject.data._needParticipations && resProject.data._needParticipations.length > 0) {
			resProject.data._needParticipations.forEach(v => {
				needParticipation = {
					_id: v._id,
					need: v.need,
					value: v.value,
					status: v.status,
					address: v.address,
					pickupDate: v.pickupDate,
					activeHours: v.activeHours,
					startDate: v.startDate,
					endDate: v.endDate
				}
				participations[v.need] = needParticipation
			})
		}

		resProject.data._needParticipations = participations

		yield put({
			type: SET_ONLOAD_PROJECT,
			project: {
				...resProject.data,
				user: { ...resUser.data.user }
			}
		})
	} catch (error) {
		yield put(errorHandler(error))
		yield put({
			type: SET_ONLOAD_PROJECT,
			project: null
		})
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'loadProject' }
		})
		yield put({ type: SET_REQUEST_CRETE_PROJECT, request: false })
	}
}

export function* editProject(data) {
	yield put({ type: SET_REQUEST_CRETE_PROJECT, request: true })
	let { file, _id, userId } = data // cover - projectType

	delete data.file
	delete data.type
	delete data.cover
	delete data._id
	delete data.projectType
	delete data.userId
	if (data && data.location && data.location.geo) data.location.geo.reverse()

	try {
		if (file) {
			const formData = new FormData()
			formData.append('cover', file)

			yield call(axios.patch, `project/${_id}/cover`, formData, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
		}

		yield call(axios.patch, `project/${_id}`, {
			...data
		})
		yield put(push(`/${userId}/project/${_id}`))
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({ type: SET_REQUEST_CRETE_PROJECT, request: false })
	}
}

function* getProjects({ data }) {
	let {
		projects,
		typeProjects,
		isFollow,
		createdBy
	} = store.getState().project;
	
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getProjects' }
		})
		let createdByFlag = data.userId ? `&createdBy=${data.userId}` : ''
		let type = data.activeType > -1 ? `&type=${data.activeType}` : ''
		let isFollowFlag = data.isFollow ? `&isFollow=1` : ''
		let title = data.title ? `&title=${data.title}` : ''
		let interests = data.interests && data.interests.length > 0 ? `&interests=${data.interests.join()}` : ''
		let date = data.date ? `&date=${data.date}` : ''
		let coordinates = (data.coordinates && data.coordinates.length === 2) ? `&lng=${data.coordinates[0]}&lat=${data.coordinates[1]}` : ''
		let isActiveFlag = data.isActive ? `&isActive=1` : '';
		let onlyShowFutureProjects = data.onlyShowFutureProjects ? `&onlyShowFutureProjects=true` : '';
		let isWeLove = data.isWeLove ? `&isWeLove=1` : '';

		let res = yield call(
			axios.get,
			`/project?skip=${data.skip}&limit=${
				data.limit
			}${createdByFlag}${type}${isFollowFlag}${title}${interests}${date}${coordinates}${isActiveFlag}${onlyShowFutureProjects}${isWeLove}`
		);

		let concatProjectArray = []

		if (!data.type) {
			if (data.skip !== 0) {
				if (
					typeProjects !== type ||
					isFollowFlag !== isFollow ||
					createdByFlag !== createdBy
				) {
					for (let i = 0; i < data.limit && i < projects.length; i++) {
						if (projects[i].projectType === data.activeType) {
							concatProjectArray.push(projects[i])
						}
					}
				} else {
					concatProjectArray = [...projects]
				}	
			}
		} else if (data.type === 'all') {
			concatProjectArray = [...res.data];
		}

		res.data.forEach(e => {
			if (concatProjectArray.findIndex(i => i._id === e._id) === -1) {
				concatProjectArray.push(e);
			}
		});
		
		yield put({
			type: SET_PROJECTS,
			projects: [...concatProjectArray],
			typeProjects: type,
			isFollow: isFollowFlag,
			createdBy: createdByFlag
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getProjects' }
		})
		data.cb && data.cb()
	}
}

function* getAllProjects({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getAllProjects' }
		});
		
		let res = yield call(
			axios.get,
			`/project?skip=${data.skip}&limit=${
				data.limit
			}`
		)

		let concatProjectArray = [];		
		res.data.forEach(e => {
			if (concatProjectArray.findIndex(i => i._id === e._id) === -1) {
				concatProjectArray.push(e);
			}
		});
		
		yield put({
			type: SET_ALL_PROJECTS,
			projects: [...concatProjectArray]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getAllProjects' }
		})
		data.cb && data.cb()
	}
}

function* projectSubscription({ data }) {
	let {
		projects,
		typeProjects,
		isFollow,
		createdBy,
		openProject
	} = store.getState().project
	let { token } = store.getState().authentication

	if (!token) return yield put(push(`?modal=${signIn}`))
	try {
		yield call(
			axios[data.isFollow ? 'delete' : 'post'],
			`project/${data.id}/followings`
		)

		yield put({
			type: SET_PROJECTS,
			projects: projects.map(e => {
				let newProjectItem = { ...e }
				if (data.id === e._id) {
					newProjectItem.isFollow = !data.isFollow
				}
				return newProjectItem
			}),
			typeProjects,
			isFollow,
			createdBy
		})
		if (openProject._id === data.id) yield put(getProjectById(data.id))
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getParticipationList({ data, skip }) {
	try {
		let currentNeedPeoples = yield call(
			axios.get,
			`project/${data.project}/need/${data._id}/request${
				skip !== 0 ? `?skip=${skip}` : ''
			}`
		)

		yield put({ type: SET_CURRENT_NEEDS_USERS, currentNeedPeoples, skip })
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* confirmOrRejectParticipation({ data }) {
	let {giveList} = store.getState().give
	try {
		let body = {
			status: data.status
		}

		yield call(
			axios.patch,
			`/project/${data.projectId}/request/${data._id}`,
			body
		)
		
		if(data.projectRequest) {
			let tmpGive = giveList.map(g => {
				if(g._id === data._id) {
					g.status = data.status
				}
				return g
			})
			yield put({
				type: SET_GIVE_LIST,
				giveList: tmpGive
			})
		} else {
			yield put({
				type: SET_CHANGES_NEED_APPLY,
				data
			})
		}
		
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* requestNeedDonation({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'requestPickups' }
		})

		let needParticipants = yield call(
			axios.post,
			`/project/${data.project}/requestNeeds`,
			data
		)

		yield put ({
			type: UPDATE_NEED_PARTICIPATIONS,
			data: needParticipants.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'requestPickups' }
		})
	}
}

function* getRequests({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getRequests' }
		})

		let projectType = data.projectType > -1 ? `&projectType=${data.projectType}` : ''
		let status = data.status ? `&status=${data.status}` : ''
		let projectId = data.projectId ? `&projectId=${data.projectId}` : ''
		let search = data.search ? `&fullName=${data.search}` : ''

		let res = yield call(
			axios.get,
			`/project/need/management?skip=${data.skip}&limit=${data.limit}${projectType}${status}${projectId}${search}`
		)

		yield put({
			type: SET_REQUESTS,
			requests: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getRequests' }
		})
		data.cb && data.cb()
	}
}

function* getProjectRequests({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getProjectRequests' }
		})

		let projectType = data.projectType > -1 ? `&projectType=${data.projectType}` : ''
		let status = data.status ? `&status=${data.status}` : ''
		let projectId = data.projectId ? `&projectId=${data.projectId}` : ''
		let search = data.search ? `&fullName=${data.search}` : ''

		let res = yield call(
			axios.get,
			`/project/need/management?skip=${data.skip}&limit=${data.limit}${projectType}${status}${projectId}${search}`
		)

		yield put({
			type: SET_PROJECT_REQUESTS,
			requests: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getProjectRequests' }
		})
		data.cb && data.cb()
	}
}

function* donateMoney({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'submittingDonate' }
		})
		const project = data.project
		delete data.project
		const res = yield call(
			axios.post,
			`/project/${project}/requestDonate`,
			data
		)
		yield put({
			type: SET_DONATE_ID,
			data: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'submittingDonate' }
		})
		data.cb && data.cb()
	}
}

function* sendReceipt({ data }) {
	try {
		yield call(
			axios.get,
			`/donate/${data.donate_id}/sendReceipt`
		)
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getDashboardData() {
	try {
		const res = yield call(
			axios.get,
			`/dashboard/nonprofit`
		)
		yield put({
			type: SET_DASHBOARD_DATA,
			data: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* setVolunteerActivity({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'setVolunteer' }
		})

		let needParticipants = yield call(
			axios.post,
			`/project/${data.project}/requestVolunteer`,
			data
		)

		yield put ({
			type: UPDATE_REQUEST_PARTICIPATION,
			data: needParticipants.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'setVolunteer' }
		})
		data.cb && data.cb()
	}
}

function* updateVolunteerRequest({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'updateVolunteer' }
		})

		let request = yield call(
			axios.post,
			`/request/${data._id}`,
			data
		)

		yield put ({
			type: UPDATE_REQUEST_PARTICIPATION,
			data: request.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'updateVolunteer' }
		})
		data.cb && data.cb()
	}
}

function* updatePickupRequest({ data }) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'updatePickupRequest' }
		})

		let request = yield call(
			axios.post,
			`/request/${data._id}`,
			data
		)

		yield put ({
			type: UPDATE_REQUEST_PARTICIPATION,
			data: request.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'updatePickupRequest' }
		})
		data.cb && data.cb()
	}
}

export function* turnoffProject(data) {
	yield put({ type: SET_REQUEST_CRETE_PROJECT, request: true })
	let { _id } = data // cover - projectType

	try {
		let res = yield call(axios.patch, `/project/turnoff/${_id}`, {
			...data
		});

		yield put({
			type: SET_PROJECT_TURN_ON_OFF_STATUS,
			data: res.data.isTurnedOff
		});
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({ type: SET_REQUEST_CRETE_PROJECT, request: false })
	}
}

export function* cancelProject(data) {
	yield put({ type: SET_REQUEST_CRETE_PROJECT, request: true })
	let { _id } = data // cover - projectType

	try {
		let res = yield call(axios.patch, `/project/cancel/${_id}`, {
			...data
		})

		yield put({
			type: SET_PROJECT_CANCEL_RECOVER_STATUS,
			data: res.data.isCancel
		});
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({ type: SET_REQUEST_CRETE_PROJECT, request: false })
	}
}

export function* project() {
	yield takeLatest(CONFIRM_OR_REJECT_NEED_PARTICIPATION, confirmOrRejectParticipation)
	yield takeLatest(GET_NEED_PARTICIPATION_LIST, getParticipationList)
	yield takeLatest(CREATE_PROJECT, createProject)
	yield takeLatest(GET_PROJECT_BY_ID, loadProject)
	yield takeLatest(EDIT_PROJECT, editProject)
	yield takeLatest(GET_PROJECTS, getProjects)
	yield takeLatest(GET_ALL_PROJECTS, getAllProjects)
	yield takeLatest(PROJECT_SUBSCRIPTION, projectSubscription)
	yield takeLatest(REQUEST_NEED_DONATION, requestNeedDonation)
	yield takeLatest(GET_REQUESTS, getRequests)
	yield takeLatest(GET_PROJECT_REQUESTS, getProjectRequests)
	yield takeLatest(DONATE_MONEY, donateMoney)
	yield takeLatest(SEND_RECEIPT, sendReceipt)
	yield takeLatest(GET_DASHBOARD_DATA, getDashboardData)
	yield takeLatest(SET_VOLUNTEER_ACTIVITY, setVolunteerActivity)
	yield takeLatest(UPDATE_VOLUNTEER_REQUEST, updateVolunteerRequest)
	yield takeLatest(UPDATE_PICKUP_REQUEST, updatePickupRequest)
	yield takeLatest(TURNOFF_PROJECT, turnoffProject)
	yield takeLatest(CANCEL_PROJECT, cancelProject)
}