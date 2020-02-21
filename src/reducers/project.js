import {
	SET_CURRENT_NEEDS_USERS,
	SET_REQUEST_CRETE_PROJECT,
	SET_ONLOAD_PROJECT,
	CLEAR_PROJECT,
	SET_PROJECTS,
	SET_ALL_PROJECTS,
	CLEAR_PROJECTS_LIST,
	SET_CHANGES_NEED_APPLY,
	SET_NEED_PARTICIPATION_VALUE,
	UPDATE_NEED_PARTICIPATIONS,
	UPDATE_REQUEST_PARTICIPATION,
	SET_REQUESTS,
	CLEAR_REQUESTS,
	SET_PROJECT_REQUESTS,
	CLEAR_PROJECT_REQUESTS,
	SET_DASHBOARD_DATA,
	CLEAR_DASHBOARD_DATA,
	SET_DONATE_ID,
	CLEAR_DONATE_ID,
	SET_PROJECT_TURN_ON_OFF_STATUS,
	SET_PROJECT_CANCEL_RECOVER_STATUS
} from '../actions/types'

import { PENDING, CANCEL, REJECT } from '../helpers/participationTypes'

const initState = {
	currentNeedPeoples: [],
	request: false,
	openProject: {},
	projects: [],
	typeProjects: null,
	isFollow: false,
	createdBy: '',
	requests: {},
	projectRequests: {},
	dashboardData: {},
	donate_id: null
}

export default function(state = initState, action) {
	const { type } = action
	if (SET_CURRENT_NEEDS_USERS === type) {
		if (action.skip === 0) {
			return {
				...state,
				currentNeedPeoples: action.currentNeedPeoples.data.length
					? action.currentNeedPeoples.data
					: []
			}
		} else {
			return {
				...state,
				currentNeedPeoples: [
					...state.currentNeedPeoples,
					...action.currentNeedPeoples.data
				]
			}
		}
	}

	if (SET_REQUEST_CRETE_PROJECT === type) {
		return {
			...state,
			request: action.request
		}
	}

	if (SET_CHANGES_NEED_APPLY === type) {
		let openProject = state.openProject
		let currentNeedPeoples = state.currentNeedPeoples
		let requests = state.requests
		let projectRequests = state.projectRequests
		let dashboardData = state.dashboardData

		if (openProject._id) {
			let _state = { ...state }
			if (currentNeedPeoples.length > 0) {
				currentNeedPeoples = currentNeedPeoples.map(elem => {
					if (elem._id === action.data._id) {
						elem.status = action.data.status
					}
					return elem
				})

				_state.currentNeedPeoples = JSON.parse(JSON.stringify(currentNeedPeoples))
			}
			
			let need_index = openProject.needs.findIndex(elem => {
				return elem._id === action.data.need
			})

			switch (action.data.status) {
				case PENDING:
					openProject.needs[need_index].current += Number(action.data.value)
					break;
				case CANCEL:
					openProject.needs[need_index].current -= Number(action.data.value)
					break;
				case REJECT:
					openProject.needs[need_index].current -= Number(action.data.value)
					break;
				default:
					break;
			}

			openProject._needParticipations[action.data.need].status = action.data.status

			_state.openProject = JSON.parse(JSON.stringify(openProject))

			return _state
		}
		else if (requests.rows || projectRequests.rows) {
			if (requests.rows && requests.rows.length > 0) {
				requests.rows = requests.rows.map(elem => {
					if (elem._id === action.data._id) {
						elem.status = action.data.status
					}
					return elem
				})
			}
			if (projectRequests.rows && projectRequests.rows.length > 0) {
				projectRequests.rows = projectRequests.rows.map(elem => {
					if (elem._id === action.data._id) {
						elem.status = action.data.status
					}
					return elem
				})
			}

			requests = JSON.parse(JSON.stringify(requests))
			projectRequests = JSON.parse(JSON.stringify(projectRequests))

			return {
				...state,
				requests,
				projectRequests
			}
		}
		else if (dashboardData.pickupRequests && dashboardData.pickupRequests.length > 0) {
			dashboardData.pickupRequests = dashboardData.pickupRequests.map(elem => {
				if (elem._id === action.data._id) {
					elem.status = action.data.status
				}
				return elem
			})

			dashboardData = JSON.parse(JSON.stringify(dashboardData))

			return {
				...state,
				dashboardData
			}
		}

		return state
	}

	if (SET_NEED_PARTICIPATION_VALUE === type) {
		let openProject = JSON.parse(JSON.stringify(state.openProject))
		if (!openProject._needParticipations[action.data.needId]) {
			openProject._needParticipations[action.data.needId] = {
				_id: action.data.needId,
				status: PENDING
			}
		}
		openProject._needParticipations[action.data.needId].value = action.data.value

		return {
			...state,
			openProject
		}
	}

	if (UPDATE_NEED_PARTICIPATIONS === type) {
		let openProject = JSON.parse(JSON.stringify(state.openProject))

		let participations = {}, needParticipation = {}
		action.data.forEach(v => {
			let need_index = openProject.needs.findIndex(elem => {
				return elem._id === v.need
			})

			switch (v.status) {
				case PENDING:
					if (openProject._needParticipations[v.need]) {
						openProject.needs[need_index].current -= openProject._needParticipations[v.need].value
					}
					openProject.needs[need_index].current += Number(v.value)
					break;
				case CANCEL:
					openProject.needs[need_index].current -= Number(v.value)
					break;
				case REJECT:
					openProject.needs[need_index].current -= Number(v.value)
					break;
				default:
					break;
			}
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
		openProject._needParticipations = {...openProject._needParticipations, ...participations}

		return {
			...state,
			openProject
		}
	}

	if (UPDATE_REQUEST_PARTICIPATION === type) {
		let openProject = JSON.parse(JSON.stringify(state.openProject))

		/*let need_index = openProject.needs.findIndex(elem => {
			return elem._id === action.data.need
		})

		let activeHours = Number(action.data.activeHours);
		if (isNaN(activeHours)) {
			activeHours = 0;
		}
		switch (action.data.status) {
			case PENDING:
				if (openProject._needParticipations[action.data.need]) {
					openProject.needs[need_index].current -= openProject._needParticipations[action.data.need].activeHours
				}
				openProject.needs[need_index].current += activeHours;
				break;
			case CANCEL:
				openProject.needs[need_index].current -= activeHours;
				break;
			case REJECT:
				openProject.needs[need_index].current -= activeHours;
				break;
			default:
				break;
		}*/

		let need_index = openProject.needs.findIndex(elem => {
			return elem._id === action.data.need
		})

		switch (action.data.status) {
			case PENDING:
				if (openProject._needParticipations[action.data.need]) {
				} else {
					openProject.needs[need_index].current += 1;
				}
				break;
			case CANCEL:
				openProject.needs[need_index].current -= 1;
				break;
			case REJECT:
				openProject.needs[need_index].current -= 1;
				break;
			default:
				break;
		}

		if (openProject._needParticipations[action.data.need]) {
			openProject._needParticipations[action.data.need] = {...openProject._needParticipations[action.data.need], ...action.data}
		}
		else {
			openProject._needParticipations[action.data.need] = {...action.data}
		}
	
		return {
			...state,
			openProject
		}
	}

	if (SET_ONLOAD_PROJECT === type) {
		return {
			...state,
			openProject: action.project
				? {
						...action.project
				  }
				: {}
		}
	}
	if (CLEAR_PROJECT === type) {
		return {
			...state,
			openProject: {}
		}
	}
	if (CLEAR_PROJECTS_LIST === type) {
		return {
			...state,
			projects: []
		}
	}

	if (SET_PROJECTS === type) {
		return {
			...state,
			projects: [...action.projects],
			typeProjects: action.typeProjects,
			isFollow: action.isFollow,
			createdBy: action.createdBy
		}
	}

	if (SET_ALL_PROJECTS === type) {
		return {
			...state,
			projects: [...action.projects]
		}
	}

	if (SET_REQUESTS === type) {
		let requests = {
			rows: action.requests && action.requests.rows.length
				? action.requests.rows
				: [],
			total: action.requests && action.requests.pageInfo.length
				? action.requests.pageInfo[0].count : 0
		}
		return {
			...state,
			requests: requests
		}
	}

	if (CLEAR_REQUESTS === type) {
		return {
			...state,
			requests: {}
		}
	}

	if (SET_PROJECT_REQUESTS === type) {
		let requests = {
			rows: action.requests && action.requests.rows.length
				? action.requests.rows
				: [],
			total: action.requests && action.requests.pageInfo.length
				? action.requests.pageInfo[0].count : 0
		}
		return {
			...state,
			projectRequests: requests
		}
	}

	if (CLEAR_PROJECT_REQUESTS === type) {
		return {
			...state,
			projectRequests: {}
		}
	}

	if (SET_DASHBOARD_DATA === type) {
		return {
			...state,
			dashboardData: action.data
		}
	}

	if (CLEAR_DASHBOARD_DATA === type) {
		return {
			...state,
			dashboardData: {}
		}
	}

	if (SET_DONATE_ID === type) {
		let openProject = state.openProject
		openProject.money.current += action.data.amount
		return {
			...state,
			openProject,
			donate_id: action.data._id
		}
	}

	if (CLEAR_DONATE_ID === type) {
		return {
			...state,
			donate_id: null
		}
	}

	if (SET_PROJECT_TURN_ON_OFF_STATUS === type) {
		let openProject = JSON.parse(JSON.stringify(state.openProject));
		openProject.isTurnedOff = action.data;

		return {
			...state,
			openProject
		}
	}

	if (SET_PROJECT_CANCEL_RECOVER_STATUS === type) {
		let openProject = JSON.parse(JSON.stringify(state.openProject));
		openProject.isCancel = action.data;

		return {
			...state,
			openProject
		}
	}

	return state
}