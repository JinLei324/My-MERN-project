import { put, takeLatest, call } from 'redux-saga/effects'
import {
    CREATE_POST,
    SET_REQUEST_CRETE_POST,
    NOTIFICATION_TOGGLE,
    PRELOADER_TOGGLE,
    SET_POSTS,
	GET_POSTS,
	GET_MY_SHARED_POSTS,
	POST_LIKE,
	POST_COMMENT,
	SHARE_POST,
	SET_MY_SHARED_POSTS,
	// CLEAR_POST_LIST,
	GET_POPULAR_AUTHORS,
	SET_POP_AUTHORS,
	GET_POPULAR_NEWS,
	SET_POP_NEWS,
	DELETE_POST,
	EDIT_POST,
	GET_MEDIA_LIST,
	SET_MEDIA_LIST,
	DELETE_COMMENT,
	OPEN_POST,
	GET_POST_BY_ID,
	CLOSE_POST
} from '../actions/types'
//import { push } from 'react-router-redux'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import { store } from '../store'
import moment from 'moment'

function errorHandler(error) {
	return {
		type: NOTIFICATION_TOGGLE,
		payload: {
			isOpen: true,
			resend: false,
			firstTitle: 'Error',
			secondTitle: getErrorText(error),
			buttonText: 'Ok'
		}
	}
}

export function* createPost(data) {
    yield put({ type: SET_REQUEST_CRETE_POST, request: true })
	let { file , contentType} = data
	let {
		posts
	} = store.getState().post

	delete data.file

	try {
		const formData = new FormData()

		let res ;
		if (contentType !== 0) {
			formData.append('media', file)
			res = yield call(axios.post, `post/media`, formData, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			data.medias = []
			data.medias.push({
				type: contentType,
				url: res.data.path,
				thumbUrl: res.data.thumbPath
			})
		}
        res = yield call(axios.post, 'post', {
            ...data
		})

		let postArray = []
		postArray = [...posts]

		let newPost = res.data;
		newPost.isLike = false;
		newPost.comment_list = []
		newPost.commentCount = 0
		newPost.likeCount = 0
		newPost.createdAt = newPost.updatedAt = moment.unix(res.data.createdAt)
		postArray.unshift(newPost);

		yield put({
			type: SET_POSTS,
			posts: [...postArray]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({ type: SET_REQUEST_CRETE_POST, request: false })
		data.cb && data.cb();
	}
}

export function* editPost(data) {
	yield put({ type: SET_REQUEST_CRETE_POST, request: true })
	let { file , contentType} = data
	let {
		posts
	} = store.getState().post

	delete data.file
	try {
		const formData = new FormData()
		let res = null
		if(file) {
			formData.append('media', file)
			res = yield call(axios.patch, `post/${data.id}/media`, formData, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			data.medias = []
			data.medias.push({
				type: contentType,
				url: res.data.path
			})
		}
		res = yield call(axios.patch, `post/${data.id}`, {
            ...data
		})

		let updatedPost = res.data;
		updatedPost.updatedAt = moment.unix(res.data.updatedAt)
		yield put({
			type: SET_POSTS,
			posts: posts.map(e => {
				let postItem = { ...e }
				if (data.id === e._id) {
					postItem.content = updatedPost.content
					postItem.medias = updatedPost.medias
					postItem.title = updatedPost.title
					postItem.updatedAt = updatedPost.updatedAt
				}
				return postItem
			})
		})
	}catch(error){

	}finally {
		yield put({ type: SET_REQUEST_CRETE_POST, request: false })
		data.cb && data.cb();
	}
}

function* getPosts({ data }) {
	let {
		posts
	} = store.getState().post

	try {
		let userId = data.userId ? `&userId=${data.userId}`:''
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getPosts' }
		});
		const path = data.getAll ? 'post/all' : 'post';
		let res = yield call(
			axios.get,
			`/${path}?skip=${data.skip}&limit=${
				data.limit
			}${userId}`
        )

		let postArray = []
        postArray = [...posts]

		res.data.forEach(e => {
			if (postArray.findIndex(i => i._id === e._id) === -1) {
				postArray.push(e)
			}
		})

		yield put({
			type: SET_POSTS,
			posts: [...postArray]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getPosts' }
		})
		data.cb && data.cb()
	}
}

function* postLike({ data }) {
	let {
		posts,
		openPost
	} = store.getState().post

	try {
		yield call(
			axios[data.isLike ? 'delete' : 'post'],
			`post/${data.id}/liking`
		)
		yield put({
			type: SET_POSTS,
			posts: posts.map(e => {
				let postItem = { ...e }
				if (data.id === e._id) {
					postItem.isLike = !data.isLike
					if (postItem.isLike)
						postItem.likeCount ++;
					else
						postItem.likeCount --;
				}
				return postItem
			})
		})

		if (openPost) {
			openPost.isLike = !data.isLike
			if (openPost.isLike) {
				openPost.likeCount ++
			} else {
				openPost.likeCount --
			}
			yield put({
				type: OPEN_POST,
				post: openPost
			})
		}
	} catch (error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* postComment({ data }) {
	let {
		posts,
		openPost
	} = store.getState().post
	const {id} = data
	delete data.id
	try {
		let res = yield call(
			axios.post,
			`post/${id}/comment`, {
				...data
			}
		)
		res.data[0].createdAt = moment.unix(res.data[0].createdAt)
		yield put({
			type: SET_POSTS,
			posts: posts.map(e => {
				let postItem = { ...e }
				if (id === e._id) {
					postItem.comment_list.push(res.data[0])
					postItem.comment_list.sort((a,b) => (a.full_slug > b.full_slug) ? 1 : ((b.full_slug > a.full_slug) ? -1 : 0));
					postItem.commentCount ++;
				}
				return postItem
			})
		})
		if (openPost) {
			openPost.comment_list.push(res.data[0])
			openPost.comment_list.sort((a,b) => (a.full_slug > b.full_slug) ? 1 : ((b.full_slug > a.full_slug) ? -1 : 0));
			openPost.commentCount ++;
			yield put({
				type: OPEN_POST,
				post: openPost
			})
		}
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* deleteComment({data}) {
	let {
		posts,
		openPost
	} = store.getState().post
	try{
		yield call(axios.delete, `/post/comment/${data._id}`)
		yield put({
			type: SET_POSTS,
			posts: posts.map(e => {
				let postItem = { ...e }
				if (data.postId === e._id) {
					postItem.comment_list = postItem.comment_list.filter(c => {
						if(c._id === data._id)
							return false
						else
							return true
					})
					postItem.commentCount --;
				}
				return postItem
			})
		})
		if (openPost) {
			openPost.comment_list = openPost.comment_list.filter(c => {
				if(c._id === data._id)
					return false
				else
					return true
			})
			openPost.commentCount --;
			yield put({
				type: OPEN_POST,
				post: openPost
			})
		}
	} catch (error) {
		yield put(errorHandler(error))
	}
}

function* sharePost({ data }) {
	let notifyData = {};

	let {
		posts,
		openPost
	} = store.getState().post;

	try {
		let { data: resData } = yield call(
			axios[data.isShared ? 'delete' : 'post'],
			`post/${data.id}/share`
		);

		let postArray = [];
		postArray = [...posts];

		if (resData.isShared) {
			if (resData.sharedPost && resData.sharedPost.length > 0) {
				let addedPost = resData.sharedPost.find(i => i._id === resData.postId);
				if (!data.userId) {
					postArray.unshift(addedPost);
				}

				if (openPost) {
					yield put({
						type: OPEN_POST,
						post: addedPost
					});
				}
			}
		} else {
			let removePostIndex = postArray.findIndex(i => i._id === resData.postId);
			postArray.splice(removePostIndex, 1);
			
			if (openPost) {
				yield put({ type: CLOSE_POST });
			}
		}
		
		yield put({
			type: SET_POSTS,
			posts: [...postArray]
		});

		notifyData = {
			firstTitle: 'Success'
		};

		if (data.isShared) {
			notifyData = { ...notifyData, secondTitle: 'You unhared this post!' };
		} else {
			notifyData = { ...notifyData, secondTitle: 'You shared this post!' };
		}
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...notifyData,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* getPopAuthors({ data }) {

	try {
		let name = data.name ? `&name=${data.name}` : ''

		let res = yield call(
			axios.get,
			`/post/popular_authors?skip=${data.skip}&limit=${
				data.limit
			}${name}`
        )

		yield put({
			type: SET_POP_AUTHORS,
			authors: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getPopularNews({ data }) {

	try {
		let res = yield call(
			axios.get,
			`/post/popular_news?skip=${data.skip}&limit=${
				data.limit
			}`
		)

		yield put({
			type: SET_POP_NEWS,
			popNews: res.data
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* deletePost({data}) {
	let {
		posts
	} = store.getState().post;
	try{
		yield call(axios.delete, `post/${data.pId}`);
		let postArray = []
		postArray = posts.filter((e) => e._id !== data.pId)
		yield put({
			type: SET_POSTS,
			posts: postArray
		})
	} catch (error) {
		yield(put(errorHandler(error)))
	} finally {
		data.cb && data.cb()
	}
}

function* getMediaList({data}) {
	let {
		mediaList
	} = store.getState().post

	try {
		let userId = data.userId ? `&userId=${data.userId}`:''
		let res = yield call(
			axios.get,
			`/media?skip=${data.skip}&limit=${
				data.limit
			}${userId}`
        )

		let mediaArray = []
        mediaArray = [...mediaList]

		res.data.forEach(e => {
			if (mediaArray.findIndex(i => i._id === e._id) === -1) {
				mediaArray.push(e)
			}
		})

		yield put({
			type: SET_MEDIA_LIST,
			mediaList: [...mediaArray]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb()
	}
}

function* getPostById({data}) {
	try {
		let res = yield call(axios.get, `/post/${data._id}`);
		let openedPost = { ...res.data };
		if (data.selectedUserId) {
			openedPost.selectedUserId = data.selectedUserId;
		}

		yield put({
			type: OPEN_POST,
			post: openedPost,
			edit: data.edit
		})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* getMySharedPosts({ data }) {
	let {
		mySharedPosts
	} = store.getState().post

	try {
		let userId = data.userId ? `&userId=${data.userId}`:''
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'getMySharedPosts' }
		})
		let res = yield call(
			axios.get,
			`/post/shared?skip=${data.skip}&limit=${
				data.limit
			}${userId}`
        )

		let postArray = []
        postArray = [...mySharedPosts]

		res.data.forEach(e => {
			if (postArray.findIndex(i => i._id === e._id) === -1) {
				postArray.push(e)
			}
		})

		yield put({
			type: SET_MY_SHARED_POSTS,
			mySharedPosts: [...postArray]
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'getMySharedPosts' }
		})
		data.cb && data.cb()
	}
}

export function* post() {
    yield takeLatest(CREATE_POST, createPost)
	yield takeLatest(GET_POSTS, getPosts)
	yield takeLatest(POST_LIKE, postLike)
	yield takeLatest(POST_COMMENT, postComment)
	yield takeLatest(SHARE_POST, sharePost)
	yield takeLatest(GET_POPULAR_AUTHORS, getPopAuthors)
	yield takeLatest(GET_POPULAR_NEWS, getPopularNews)
	yield takeLatest(DELETE_POST, deletePost)
	yield takeLatest(EDIT_POST, editPost)
	yield takeLatest(GET_MEDIA_LIST, getMediaList)
	yield takeLatest(DELETE_COMMENT, deleteComment)
	yield takeLatest(GET_POST_BY_ID, getPostById)
	yield takeLatest(GET_MY_SHARED_POSTS, getMySharedPosts)
}
