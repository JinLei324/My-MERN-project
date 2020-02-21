import { SET_SCHOOLS, SET_SINGLE_SCHOOL, SET_INTERESTS, SET_HIERARCHY_INTERESTS, SET_CATEGORIES, SET_NOTIFICATION_LIST, SET_UNREAD_NOTIFY } from '../actions/types'

const initialState = {
	schools: [],
	singleSchool: {},
	interests: [],
	notifications: [],
	pendingFriends: [],
	unreadNotify: 0
}

export default (state = initialState, action) => {
	if (action.type === SET_SCHOOLS) {
		return {
			...state,
			schools: action.schools
		}
	}

	if (action.type === SET_SINGLE_SCHOOL) {
		if (action.skip === 0) {
			return {
				...state,
				singleSchool: action.singleSchool
			}
		} else {
			let singleSchool = state.singleSchool
			if (action.singleSchool.students) {
				singleSchool.students = [
					...singleSchool.students,
					...action.singleSchool.students
				]
			}
			return {
				...state,
				singleSchool
			}
		}
	}

	if (action.type === SET_INTERESTS) {
		return {
			...state,
			interests: action.interests
		}
	}

	if (action.type === SET_HIERARCHY_INTERESTS) {
		return {
			...state,
			hierarchyInterests: action.interests
		}
	}

	if (action.type === SET_CATEGORIES) {
		return {
			...state,
			categories: action.categories
		}
	}

	if (action.type === SET_NOTIFICATION_LIST) {
		return {
			...state,
			notifications: action.notifications,
			pendingFriends: action.pendings,
			unreadNotify: action.unreadNotify
		}
	}

	if (action.type === SET_UNREAD_NOTIFY) {
		return {
			...state,
			unreadNotify: action.unreadNotify
		}
	}

	return state
}
