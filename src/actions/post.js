import {
    CREATE_POST,
    GET_POSTS,
    CLEAR_POST_LIST,
    POST_LIKE,
    POST_COMMENT,
    GET_POPULAR_AUTHORS,
    GET_POPULAR_NEWS,
    DELETE_POST,
    EDIT_POST,
    GET_MEDIA_LIST,
    CLEAR_MEDIA_LIST,
    DELETE_COMMENT,
    CLOSE_POST,
    GET_POST_BY_ID,
    SHARE_POST,
    GET_MY_SHARED_POSTS,
    CLEAR_MY_SHARED_POST_LIST
} from './types'

export const createPost = data => ({
	type: CREATE_POST,
	...data
})

export const editPost = data => ({
    type: EDIT_POST,
    ...data
})

export const getPosts = data => ({
    type: GET_POSTS, data
})

export const clearPosts = () => ({type: CLEAR_POST_LIST})

export const getPostLike = data => ({
	type: POST_LIKE,
	data
})

export const commentPost = data => ({
    type: POST_COMMENT,
    data
})

export const sharePost = data => ({
    type: SHARE_POST,
    data
})

export const getPopularAuthors = data => ({
    type: GET_POPULAR_AUTHORS, data
})

export const getPopularNews = data => ({
    type: GET_POPULAR_NEWS, data
})

export const deletePost = data => ({
    type: DELETE_POST, 
    data
})

export const getMediaList = data => ({
    type: GET_MEDIA_LIST, data
})

export const clearMediaList = () => ({
    type: CLEAR_MEDIA_LIST
})

export const deleteComment = data => ({
    type: DELETE_COMMENT,
    data
})

export const closePost = () => ({
    type: CLOSE_POST
})

export const getPostById = data => ({
    type: GET_POST_BY_ID,
    data
})

export const getMySharedPosts = data => ({
    type: GET_MY_SHARED_POSTS, data
})

export const clearMySharedPosts = () => ({type: CLEAR_MY_SHARED_POST_LIST})