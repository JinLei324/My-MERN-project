import {
    SET_GIVE_LIST,
    CLEAR_GIVE_LIST,
    SET_GIVE_COUNT,
    SET_RECURRING_LIST,
    CLEAR_RECURRING_LIST,
    SET_RECEIPT_LIST,
    CLEAR_RECEIPT_LIST,
    SET_MY_ACHIVEMENT_LIST,
    CLEAR_MY_ACHIVEMENT_LIST,
    SET_GIVE_ID,
    CLEAR_GIVE_ID
} from '../actions/types';

const initState = {
    giveList: [],
    recurringList: [],
    receiptList: [],
    totalCount: 0,
    giveId: null
}

export default function(state = initState, action) {
    if (action.type === SET_GIVE_LIST) {
        return {
            ...state,
            giveList: action.giveList
        }
    } 
    if (action.type === CLEAR_GIVE_LIST) {
        return {
            ...state,
            giveList: []
        }
    }
    if (action.type === SET_GIVE_COUNT) {
        return {
            ...state,
            totalCount: action.total
        }
    }
    if (action.type === SET_RECURRING_LIST) {
        return {
            ...state,
            recurringList: action.recurringList
        }
    }
    if (action.type === CLEAR_RECURRING_LIST) {
        return {
            ...state,
            recurringList: []
        }
    }
    if (action.type === SET_RECEIPT_LIST) {
        return {
            ...state,
            receiptList: action.receiptList
        }
    }
    if (action.type === CLEAR_RECEIPT_LIST) {
        return {
            ...state,
            receiptList: []
        }
    }
    if (action.type === SET_MY_ACHIVEMENT_LIST) {
        return {
            ...state,
            myAchivementList: action.myAchivementList
        }
    }
    if (action.type === CLEAR_MY_ACHIVEMENT_LIST) {
        return {
            ...state,
            myAchivementList: []
        }
    }
    if (action.type === SET_GIVE_ID) {
        return {
            ...state,
            giveId: action.data._id
        }
    }
    if (action.type === CLEAR_GIVE_ID) {
        return {
            ...state,
            giveId: null
        }
    }

    return state;
}