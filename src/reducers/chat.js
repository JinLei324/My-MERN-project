import { SET_CHAT_LIST, SET_CHAT_HISTORY, ADD_CHAT_ITEM } from "../actions/types";

const initState = {
    chatList: [],
    totCount: 0,
    chatHistory: []
}

export default function(state = initState, action) {

    const {type} = action
    
    if (type === SET_CHAT_LIST) {
        return {
            ...state,
            chatList: action.chatList,
            totCount: action.totCount
        }
    } 

    if (type === SET_CHAT_HISTORY) {
        return {
            ...state,
            chatHistory: action.chatHistory
        }
    }

    if (type === ADD_CHAT_ITEM) {
        var { chatHistory } = state
        let historyArray = []
        historyArray = [ ...chatHistory ]
        historyArray.push(action.data)
        return {
            ...state,
            chatHistory: historyArray
        }
    }

    return state

}