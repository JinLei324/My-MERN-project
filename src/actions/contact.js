import {
    CREATE_CONTACT,
    GET_CONTACT_LIST,
    CLEAR_CONTACT_LIST,
    EDIT_CONTACT,
    DELETE_CONTACT,
    UPLOAD_CONTACT_LIST,
    CLEAR_NEW_CONTACT,
    GET_CONTACT_DETAIL,
    UPLOAD_CONTACT_CSV,
    SEND_INVITE_CONTACT
} from './types'

export const createContact = data => ({
	type: CREATE_CONTACT,
	...data
})

export const getContacts = data =>({
    type: GET_CONTACT_LIST, 
    data
})

export const clearContacts = () => ({
    type: CLEAR_CONTACT_LIST
})

export const editContact = data => ({
    type: EDIT_CONTACT,
    ...data
})

export const deleteContact = data => ({
    type: DELETE_CONTACT,
    ...data
})

export const uploadContactList = data => ({
    type: UPLOAD_CONTACT_LIST,
    ...data
})

export const clearNewContact = data => ({
    type: CLEAR_NEW_CONTACT,
    ...data
})

export const getContactDetail = id => ({
    type: GET_CONTACT_DETAIL,
    id
})

export const uploadContactCsv = data => ({
    type: UPLOAD_CONTACT_CSV,
    data
})

export const sendInviteContact = data => ({
	type: SEND_INVITE_CONTACT,
	...data
})