import { put, takeLatest, call } from 'redux-saga/effects'
import {
    CREATE_CONTACT,
    NOTIFICATION_TOGGLE,
    GET_CONTACT_LIST,
    SET_CONTACT_LIST,
    EDIT_CONTACT,
    DELETE_CONTACT,
    UPLOAD_CONTACT_LIST,
    SET_NEW_CONTACT,
    SET_CONTACT_DETAIL,
    GET_CONTACT_DETAIL,
    UPLOAD_CONTACT_CSV,
    SEND_INVITE_CONTACT,
    SEND_INVITE_CONTACT_NOTIFY
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

export function* createContact(data) {
    try {
        let res = yield call(axios.post, 'contact/', {
            ...data
        });

        yield put({
            type: SET_NEW_CONTACT,
            newContact: res.data
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

export function* getContacts({data}) {
    try {
        let res = yield call(axios.get, 
            `contact?type=${data.type}&search=${data.search}&skip=${data.skip}&limit=${data.limit}`)
    
        let contactArray = res.data.contacts
        
        yield put({
            type: SET_CONTACT_LIST,
            contacts: contactArray,
            totCount: res.data.pageInfo[0].count
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

export function* editContact(data) {    
    try {
        yield call(axios.patch, `contact/${data._id}`, {
            ...data
        });
    } catch(error){
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

export function* deleteContact(data) {
    try {
        yield call(axios.delete, `contact/${data.id}`);
    } catch(error){
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

export function* uploadContactList(data) {
    const {array} = data
    try {
        yield call(axios.post, 'contact/csv', {
            contactArray: array
        });
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

export function* getContactDetail({id}) {
    try {
        let contactInfo = yield call(axios.get, `contact/${id}/detail`)
        yield put({
            type: SET_CONTACT_DETAIL,
            contactDetail: contactInfo.data
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
    }
}

export function* uploadContactCsv({data}) {
    try {
        const formData = new FormData()
        formData.append('csv', data.file)
        yield call(axios.post, `contact/upload_csv`, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
    } catch (error) {
        yield put(errorHandler(error))
    } finally {
        data.cb && data.cb()
    }
}

export function* sendInviteContact(data) {
    let notifyData = {}
    try {
        yield call(axios.post, 'contact/send-invite', {
            ...data
        });

        yield put({
            type: SEND_INVITE_CONTACT_NOTIFY
        })
        
        notifyData = {
			firstTitle: 'Success',
			secondTitle: 'Contact Invite Successfuly Sent!'
		}
    } catch (error) {
        notifyData = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
        }
        
        yield put(errorHandler(error))
    } finally {
        yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...notifyData,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
    }
}

export function* contact() {
    yield takeLatest(CREATE_CONTACT, createContact)
    yield takeLatest(GET_CONTACT_LIST, getContacts)
    yield takeLatest(EDIT_CONTACT, editContact)
    yield takeLatest(DELETE_CONTACT, deleteContact)
    yield takeLatest(UPLOAD_CONTACT_LIST, uploadContactList)
    yield takeLatest(GET_CONTACT_DETAIL, getContactDetail)
    yield takeLatest(UPLOAD_CONTACT_CSV, uploadContactCsv)
    yield takeLatest(SEND_INVITE_CONTACT, sendInviteContact)
}