import { put, takeLatest, call } from 'redux-saga/effects';

import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors';

import { store } from '../store';
import {
	GET_CHAT_LIST,
	SET_CHAT_LIST,
	NOTIFICATION_TOGGLE,
	GET_CHAT_HISTORY,
	SET_CHAT_HISTORY
} from '../actions/types';

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

export function* getChatList({ data }) {
	let contactArray = [];
	try {
		// let res = yield call(axios.get, `contact/chatlist?search=${data.search}&skip=${data.skip}&limit=${data.limit}`)
		let res = yield call(axios.get, `chat/chat_list?search=${data.search}`)

		contactArray = res.data;
		yield (put({
			type: SET_CHAT_LIST,
			chatList: contactArray,
			totCount: 0
		}));
	} catch (error) {
		yield (put(errorHandler(error)));
	} finally {
	}
}

export function* getChatHistory({ data }) {
	let { chatList } = store.getState().chat;
	try {
		let res = yield call(axios.post, 'chat/getHistory', data);
		const chatHistory = res.data;
		yield (put({
			type: SET_CHAT_HISTORY,
			chatHistory: chatHistory
		}));

		const { otherId, type } = data;
		if (type === 'one-to-one') {
			yield (put({
				type: SET_CHAT_LIST,
				chatList: chatList.map( e => {
					let newChatItem = { ...e }
					if (otherId === e._id) {
						newChatItem.unreadMsgCount = 0;
					}
					return newChatItem;
				}),
				totCount: 0
			}));
		}
	} catch (error) {
		yield (put(errorHandler(error)))
	} finally {
	}
}

export function* chat() {
	yield takeLatest(GET_CHAT_LIST, getChatList)
	yield takeLatest(GET_CHAT_HISTORY, getChatHistory)
}