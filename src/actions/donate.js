import {
    GET_DONATE_LIST,
    CANCEL_RECEIPT,
    UPDATE_RECEIPT
} from './types'

export const getDonateList = data => ({
    type: GET_DONATE_LIST, data
})

export const cancelReceipt = data => ({
    type: CANCEL_RECEIPT,
    data
})

export const updateReceipt = data => ({
    type: UPDATE_RECEIPT,
    data
})