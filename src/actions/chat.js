import { 
    GET_CHAT_LIST, 
    GET_CHAT_HISTORY,
    ADD_CHAT_ITEM
} from './types';


export const getChatList = data => ({
    type: GET_CHAT_LIST,
    data
});

export const getChatHistory = data => ({
    type: GET_CHAT_HISTORY,
    data
})

export const addChatItem = data => ({
    type: ADD_CHAT_ITEM,
    data
})