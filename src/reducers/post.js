import {
    SET_REQUEST_CRETE_POST,
    SET_POSTS,
    CLEAR_POST_LIST,
    SET_POP_AUTHORS,
    SET_POP_NEWS,
    SET_MEDIA_LIST,
    CLEAR_MEDIA_LIST,
    OPEN_POST,
    CLOSE_POST,
    SET_MY_SHARED_POSTS,
    CLEAR_MY_SHARED_POST_LIST
} from '../actions/types'

const initState = {
    request: false,
    posts: [],
    mySharedPosts: [],
    authors: [],
    popNews: [],
    mediaList: [],
    openPost: null,
    editPost: false
}

export default function(state = initState, action){
    const {type} = action
    if (type === SET_REQUEST_CRETE_POST)
    {
        return {
			...state,
			request: action.request
		}
    }
    if (type === SET_POSTS)
    {
        return{
            ...state,
            posts: action.posts
        }
    }
    if (type === CLEAR_POST_LIST)
    {
        return{
            ...state,
            posts: []
        }
    }
    if (type === SET_POP_AUTHORS){

        return {
            ...state,
            authors: action.authors
        }
    }
    if (type === SET_POP_NEWS) {
        return {
            ...state,
            popNews: action.popNews
        }
    }
    if (type === SET_MEDIA_LIST) {
        return {
            ...state,
            mediaList: action.mediaList
        }
    }
    if (type === CLEAR_MEDIA_LIST) {
        return {
            ...state,
            mediaList: []
        }
    }
    if (type === OPEN_POST) {
        return {
            ...state,
            openPost: action.post,
            editPost: action.edit
        }
    }
    if (type === CLOSE_POST) {
        return {
            ...state,
            openPost: null,
            editPost: false
        }
    }
    if (type === SET_MY_SHARED_POSTS)
    {
        return{
            ...state,
            mySharedPosts: action.mySharedPosts
        }
    }
    if (type === CLEAR_MY_SHARED_POST_LIST)
    {
        return{
            ...state,
            mySharedPosts: []
        }
    }

    return state

}