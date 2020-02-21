import { put, takeLatest, call } from 'redux-saga/effects';
import axios from '../helpers/axiosApi';
import getErrorText from '../helpers/serverErrors';
import { history } from '../store';

import { NOTIFICATION_RESEND, NOTIFICATION_TOGGLE } from '../actions/types';

function* resendMail({ email }) {
	let data = {}
	try {
		yield call(axios.post, `/token/request/resend/${email}`)

		data = {
			firstTitle: 'Success',
			secondTitle: 'Verification link has been sent to your email'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield call(history.push, '?')
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

export function* notification() {
	yield takeLatest(NOTIFICATION_RESEND, resendMail)
}
