import { put, takeLatest, call } from 'redux-saga/effects'

import {
    NOTIFICATION_TOGGLE,
	GET_QUESTION,
	SUBMIT_ANSWER,
	SET_QUESTION,
	SET_GAME_STATS,
	GET_GAME_STATS
} from '../actions/types'

import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'

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

function* getQuestion() {
	try {
		let question = yield call(
			axios.get,
			`/game/vocabulary`
        )
        yield put({ type: SET_QUESTION, question: question.data[0]})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getGameStats(){
	try{
		let stats = yield call(
			axios.get, 
			`/game/stats`
		)
		yield put({type: SET_GAME_STATS, stats: stats.data[0]})
	} catch(error){
		yield put(errorHandler(error))
	} finally{
	}
}

function* submitAnswer(data) {
	try {
		let res = yield call(
			axios.post,
			`/game/vocabulary`, {
                ...data
            }
        )

		yield put({
			type: SET_QUESTION,
			question: res.data[0]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		data.cb()
	}
}

export function* game() {
    yield takeLatest(GET_QUESTION, getQuestion)
	yield takeLatest(SUBMIT_ANSWER, submitAnswer)
	yield takeLatest(GET_GAME_STATS, getGameStats)
}
