import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'

import {
    CREATE_GIFT,
    NOTIFICATION_TOGGLE
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

export function* createGift(data) {
    try{
        yield call(axios.post, 'gift/', data.data);
    } catch(error) {
        yield(put(errorHandler(error)))
    } finally{
    }
}

export function* gift() {
    yield takeLatest(CREATE_GIFT, createGift)
}