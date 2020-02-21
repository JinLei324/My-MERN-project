import {
    SET_CONTACT_LIST,
    CLEAR_CONTACT_LIST,
    SET_NEW_CONTACT,
    CLEAR_NEW_CONTACT,
    SET_CONTACT_DETAIL,
    SEND_INVITE_CONTACT_NOTIFY
} from '../actions/types'

const initState = {
    request: false,
    contacts: [],
    totCount: 0,
    newContact: {},
    contactDetail: {}
}

export default function(state = initState, action){
    const { type } = action
    if (type === SET_CONTACT_LIST) {
        return {
            ...state,
            contacts: action.contacts,
            totCount: action.totCount
        }
    }
    if (type === CLEAR_CONTACT_LIST) {
        return {
            ...state,
            contacts: [],
            totCount: 0
        }
    }
    if (type === SET_NEW_CONTACT) {
        return {
            ...state,
            newContact: action.newContact
        }
    }
    if (type === CLEAR_NEW_CONTACT) {
        return {
            ...state,
            newContact: {}
        }
    }
    if (type === SET_CONTACT_DETAIL) {
        return {
            ...state,
            contactDetail: action.contactDetail
        }
    }
    if (type === SEND_INVITE_CONTACT_NOTIFY) {
        return {
            ...state
        }
    }
    return state;
}