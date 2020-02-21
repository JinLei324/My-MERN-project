import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import { store } from '../store'

import {
    CREATE_GIVE,
    NOTIFICATION_TOGGLE,
    GET_GIVE_LIST,
    GET_GIVE_COUNT,
    SET_GIVE_COUNT,
    SET_GIVE_LIST,
    REQUEST_GIVE_STATUS,
    UPDATE_GIVE,
    GET_RECURRING_LIST,
    SET_RECURRING_LIST,
    SET_RECEIPT_LIST,
    GET_RECEIPT_LIST,
    SET_MY_ACHIVEMENT_LIST,
    GET_MY_ACHIVEMENT_LIST,
    GIVE_DONATE,
    SET_GIVE_ID,
    GIVE_SEND_RECEIPT,
    PRELOADER_TOGGLE
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

function* createGive({data}) {
    try{
        yield call(axios.post, 'give', {
            ...data
        })
    }catch(error){
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

function* getGiveList({data}) {
    let {
        giveList
    } = store.getState().give
    try{
        let res = yield call(
			axios.get,
			`/give?skip=${data.skip}&limit=${data.limit}`
        )
        let giveArray = []
        giveArray = [...giveList]
        res.data.forEach(e => {
			if (giveArray.findIndex(i => i._id === e._id) === -1) {
				giveArray.push(e)
			}
        })
        yield put({
            type: SET_GIVE_LIST,
            giveList: giveArray
        })
    } catch(error){
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

function* getGiveCount({data}) {
    try{
        const res = yield call(axios.get, `/give/count`)
        yield put({
            type: SET_GIVE_COUNT,
            total: res.data.count
        })
    }catch(error) {
        yield put(errorHandler(error))
    } finally{
    }
}

function* requestStatus({data}) {
    let {
        giveList
    } = store.getState().give
    try{
        yield call(axios.patch, `/give/${data.id}/request`, {
            ...data
        })
        
        yield put({
            type: SET_GIVE_LIST,
            giveList: giveList.map(e => {
                let give = {...e}   
                if(e._id === data.id)
                    give.status = data.status
                return give
            })
        })
    }catch(error) {
        yield put(errorHandler(error))
    } finally{

    }
}

function* updateGiveById({data}) {
    let {
        giveList
    } = store.getState().give
    try{
        yield call(axios.patch, `give/${data._id}`, {
            ...data
        })
        yield put({
            type: SET_GIVE_LIST,
            giveList: giveList.map(e => {
                let give = {...e}   
                if(e._id === data._id)
                {
                    for(var key in data ) {
                        give[key] = data[key]
                    }
                }
                return give
            })
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

function* getRecurringList({data}) {
    let {
        recurringList
    } = store.getState().give;
    try {
        let res = yield call(
			axios.get,
			`/give/recurring?skip=${data.skip}&limit=${data.limit}&nonprofitId=${data.nonprofitId}`
        )
        
        let giveArray = []
        giveArray = [...recurringList];
        res.data.forEach(e => {
			if (giveArray.findIndex(i => i._id === e._id) === -1) {
				giveArray.push(e)
			}
        })
        yield put({
            type: SET_RECURRING_LIST,
            recurringList: giveArray
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

function* getReceiptList({data}) {
    let {
        receiptList
    } = store.getState().give
    try {
        let userId = data.userId ? `&userId=${data.userId}` :''
        let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : ''
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : ''
        let res = yield call(
			axios.get,
			`/give/receipt?skip=${data.skip}&limit=${data.limit}${userId}${sortBy}${sortDirection}`
        )
        
        let giveArray = []
        giveArray = [...receiptList]
        res.data.forEach(e => {
			if (giveArray.findIndex(i => i._id === e._id) === -1) {
				giveArray.push(e)
			}
        })
        yield put({
            type: SET_RECEIPT_LIST,
            receiptList: giveArray
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

function* giveDonate({ data }) {
    try {
        yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: true, actionName: 'givingDonate' }
        })
        let res = yield call(axios.post, '/give/donate', {
            ...data
        })
        yield put({
            type: SET_GIVE_ID,
            data: res.data
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
        yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: false, actionName: 'givingDonate' }
        })
    }
}

function* sendReceipt({ data }) {
    try {
        yield call(
            axios.get,
            `/give/${data.giveId}/sendReceipt`
        )
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

function* getMyAchivementList({data}) {
    let {
        myAchivementList
    } = store.getState().give
    try {
        let userId = data.userId ? `&userId=${data.userId}` :''
        let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : ''
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : ''
        let res = yield call(
			axios.get,
			`/user/${data._id}/my_achivement?skip=${data.skip}&limit=${data.limit}${userId}${sortBy}${sortDirection}`
        )
        
        let myAchivementArray = []
        myAchivementArray = [...myAchivementList]
        res.data.forEach(e => {
			if (myAchivementArray.findIndex(i => i._id === e._id) === -1) {
				myAchivementArray.push(e)
			}
        })
        yield put({
            type: SET_MY_ACHIVEMENT_LIST,
            myAchivementList: myAchivementArray
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

export function* give() {
    yield takeLatest(CREATE_GIVE, createGive)
    yield takeLatest(GET_GIVE_LIST, getGiveList)
    yield takeLatest(GET_GIVE_COUNT, getGiveCount)
    yield takeLatest(REQUEST_GIVE_STATUS, requestStatus)
    yield takeLatest(UPDATE_GIVE, updateGiveById)
    yield takeLatest(GET_RECURRING_LIST, getRecurringList)
    yield takeLatest(GET_RECEIPT_LIST, getReceiptList)
    yield takeLatest(GET_MY_ACHIVEMENT_LIST, getMyAchivementList)
    yield takeLatest(GIVE_DONATE, giveDonate)
    yield takeLatest(GIVE_SEND_RECEIPT, sendReceipt)
}