import {
    CREATE_GIVE,
    GET_GIVE_LIST,
    CLEAR_GIVE_LIST,
    GET_GIVE_COUNT,
    REQUEST_GIVE_STATUS,
    UPDATE_GIVE,
    GET_RECURRING_LIST,
    CLEAR_RECURRING_LIST,
    GET_RECEIPT_LIST,
    CLEAR_RECEIPT_LIST,
    GET_MY_ACHIVEMENT_LIST,
    CLEAR_MY_ACHIVEMENT_LIST,
    CLEAR_GIVE_ID,
    GIVE_DONATE,
    GIVE_SEND_RECEIPT
} from './types'

export const createGive = data => ({
    type: CREATE_GIVE,
    data
})

export const getGiveList = data => ({
    type: GET_GIVE_LIST, data
})

export const clearGiveList = () => ({
    type: CLEAR_GIVE_LIST
})

export const getGiveCount = () => ({
    type: GET_GIVE_COUNT
})

export const requestStatus = data => ({ 
    type: REQUEST_GIVE_STATUS, 
    data 
})

export const updateGive = data => ({
    type: UPDATE_GIVE,
    data
})

export const getRecurringList = data => ({
    type: GET_RECURRING_LIST, data
})

export const clearRecurringList = () => ({
    type: CLEAR_RECURRING_LIST
})

export const getReceiptList = data => ({
    type: GET_RECEIPT_LIST, data
})

export const clearReceiptList = () => ({
    type: CLEAR_RECEIPT_LIST
})

export const getMyAchivementList = data => ({
    type: GET_MY_ACHIVEMENT_LIST, data
})

export const clearMyAchivementList = () => ({
    type: CLEAR_MY_ACHIVEMENT_LIST
})

export const giveDonate = data => ({
    type: GIVE_DONATE,
    data
})

export const clearGiveId = () => ({
    type: CLEAR_GIVE_ID
})

export const sendReceipt = data => ({
    type: GIVE_SEND_RECEIPT,
    data
})