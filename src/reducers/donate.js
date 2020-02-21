import {
    SET_DONATE_LIST
} from '../actions/types'

const initState = {
    donateList: []
}

export default function(state = initState, action) {

    if (action.type === SET_DONATE_LIST){
        return {
            ...state,
            donateList: action.donateList
        }
    }
    return state
    
}