import { put, takeLatest, call } from 'redux-saga/effects';
import axios from '../helpers/axiosApi';
import getErrorText from '../helpers/serverErrors';
import { store, history } from '../store';
import {
	FORGOT_PASSWORD,
	NOTIFICATION_TOGGLE,
	RESET_PASSWORD_MODAL,
	GET_MY_PROFILE,
	CREATE_AVATAR,
	REGISTER,
	LOGIN_START,
	SUPER_LOGIN_START,
	LOGOUT,
	GET_ME,
	SET_UP_AVATAR_URL_TO_USER,
	LOGIN,
	SUPER_LOGIN,
	LOGOUT_USER,
	CREATE_USER,
	CREATE_USER_START,
	PRELOADER_TOGGLE,
	LOGIN_FAILED,
	SUPER_LOGIN_FAILED,
	SET_UNREAD_PROJECTS,
	UNREAD_PROJECTS
} from '../actions/types';
import { STUDENT, NONPROFIT, DONOR  } from '../helpers/userRoles';
import Cookies from 'universal-cookie';

function* forgotPassword({ email }) {
	let data = {}
	try {
		yield call(axios.post, `/user/reset-password/${email}`)
		yield call(history.push, '?')

		data = {
			firstTitle: 'Success',
			secondTitle: 'Recovery link has been sent to your email'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* passwordResetModal({ password, hash }) {
	let data = {}
	try {
		yield call(axios.post, `/user/new-password/${hash}`, { password })
		yield call(history.push, '/')
	} catch (error) {
		data = {
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

function* getMyProfile() {
	let data = {}
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getMyProfile' }
		})
		let { userId } = store.getState().authentication
		let res = yield call(axios.get, `/user/${userId}`)
		yield put({
			type: GET_ME,
			payload: res.data.user
		})
	} catch (error) {
		data = {
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
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getMyProfile' }
		})
	}
}

function* createAvatar({ avatar }) {
	try {
		const formData = new FormData()
		formData.append('avatar', avatar)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		let res = yield call(axios.post, `/user/avatar`, formData, config)

		yield put({
			type: SET_UP_AVATAR_URL_TO_USER,
			payload: res.data.path
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

function* register({ email, password, role }) {
	let data = {}
	try {
		yield call(axios.post, `/token/request`, { email, password, role })
		yield call(history.push, '?')

		data = {
			firstTitle: 'Success',
			secondTitle: 'Verification link has been sent to your email!'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* login({ email, password }) {
	let resend = false
	let data = {}
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'login' }
		})
		let res = yield call(axios.post, `/token`, { email, password });
		yield put({
			type: LOGIN,
			payload: res.data,
			token: res.data.token.hash || null
		})
		
		if (res.data && res.data.user && res.data.user.role === NONPROFIT && res.data.user._id) {
			yield call(history.push, `/${res.data.user._id}/dashboard`)
		} else {
			yield call(history.push, `/discovery`)
		}
		
		const cookies = new Cookies();
		cookies.set('authorization', res.data.token.hash, { path: '/' });
	} catch (error) {		
		error.response && error.response.status === 403 && (resend = true)

		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		
		if (error.response) {
			if (error.response.status === 412) {
				const userData = JSON.stringify({
					role: error.response.data.user.role,
					email: error.response.data.user.email,
					token: error.response.data.verifyToken
				})
				localStorage.setItem('verificationForUser', userData)
				let num = error.response.data.user.role
				yield call(history.push, `/?modal=${num}`)
			} else if(error.response.status === 401) {
				const {passwordFailed} = store.getState().authentication
				
				if(passwordFailed <= 0) {
					return yield call(history.push, `/?modal=${1}`)

				} else {
					yield put({
						type: NOTIFICATION_TOGGLE,
						payload: {
							...data,
							isOpen: true,
							resend,
							buttonText: 'Ok'
						}
					})
				}
				yield put({
					type: LOGIN_FAILED
				})
			}
			
		} 	
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'login' }
		})
	}
}

function* logout() {
	try {
		yield call(axios.delete, `/token`)
		const cookies = new Cookies();
		cookies.remove('authorization', { path: '/' });
	} catch (error) {
	} finally {
		yield put({
			type: LOGOUT_USER
		})
		yield call(history.push, `/`)
	}
}

function* createUser({
	birthDate,
	firstName,
	gender,
	lastName,
	companyName,
	address,
	school,
	billingAddress,
	ein,
	donorAddress,
	interests,
	isPrivate
}) {
	try {
		const verificationForUser = JSON.parse(
			localStorage.getItem('verificationForUser')
		)
		const { role, email, token } = verificationForUser
		let data
		if (role === NONPROFIT) {
			data = {
				role,
				email,
				companyName,
				address,
				billingAddress,
				ein
			}
		} else if (role === STUDENT) {
			data = {
				birthDate,
				firstName,
				gender,
				school,
				lastName,
				role,
				email,
				donorAddress,
				interests,
				isPrivate
			}
		} else if (role === DONOR) {
			data = {
				birthDate,
				firstName,
				gender,
				lastName,
				role,
				email,
				donorAddress,
				interests,
				isPrivate
			}
		}

		let res = yield call(axios.post, `/user`, data, {
			headers: {
				'x-confirm-token': token
			}
		})
		yield put({
			type: CREATE_USER,
			payload: res.data,
			token: res.data.token.hash || null
		})
		yield call(history.push, `/${res.data.user._id}/news-feed`)

		let avatar = store.getState().authentication.avatar
		if (avatar !== null && avatar.size) {
			yield put({
				type: CREATE_AVATAR,
				avatar
			})
		}
		localStorage.removeItem('verificationForUser')
	} catch (error) {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				firstTitle: 'Error',
				secondTitle: getErrorText(error),
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
		// 'There is no user for verefication'
	} finally {
	}
}

function* setUnreadProjects({ projectType }) {
	try {
		let res = yield call(axios.patch, `/user/set-unread-projects`, {
			projectType
		})

		yield put({
			type: UNREAD_PROJECTS,
			volunteers: res.data.unreadVolunteers,
			donations: res.data.unreadDonations,
			pickups: res.data.unreadPickups
		})
	} catch (error) {
	} finally {
	}
}

function* superLogin({ super_token, user_id }) {
	let resend = false
	let data = {}
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'superLogin' }
		})
		let res = yield call(axios.post, `/super-token`, { super_token, user_id });
		yield put({
			type: SUPER_LOGIN,
			payload: res.data,
			token: res.data.token.hash || null
		})

		const cookies = new Cookies();
		cookies.set('authorization', res.data.token.hash, { path: '/' });
	} catch (error) {		
		error.response && error.response.status === 403 && (resend = true)

		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
		
		if (error.response) {
			if (error.response.status === 412) {
				const userData = JSON.stringify({
					role: error.response.data.user.role,
					email: error.response.data.user.email,
					token: error.response.data.verifyToken
				})
				localStorage.setItem('verificationForUser', userData);
			} else if (error.response.status === 401) {
				const { passwordFailed } = store.getState().authentication;
				
				if (passwordFailed <= 0) {
					return yield call(history.push, `/`)
				} else {
					yield put({
						type: NOTIFICATION_TOGGLE,
						payload: {
							...data,
							isOpen: true,
							resend,
							buttonText: 'Ok'
						}
					})
				}
				yield put({
					type: SUPER_LOGIN_FAILED
				})
			}
		} 	
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'superLogin' }
		})
	}
}

export function* auth() {
	yield takeLatest(CREATE_USER_START, createUser)
	yield takeLatest(LOGOUT, logout)
	yield takeLatest(LOGIN_START, login)
	yield takeLatest(REGISTER, register)
	yield takeLatest(CREATE_AVATAR, createAvatar)
	yield takeLatest(GET_MY_PROFILE, getMyProfile)
	yield takeLatest(FORGOT_PASSWORD, forgotPassword)
	yield takeLatest(RESET_PASSWORD_MODAL, passwordResetModal)
	yield takeLatest(SET_UNREAD_PROJECTS, setUnreadProjects)
	yield takeLatest(SUPER_LOGIN_START, superLogin)
}
