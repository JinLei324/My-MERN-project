import { put, takeLatest, call } from 'redux-saga/effects'
import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'

import { 
    NOTIFICATION_TOGGLE, 
    GET_SEARCH_BY_TYPE,
    SET_SEARCH_BY_TYPE
} from "../actions/types";
import { store } from '../store';

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


export function* getSearchByType({data}) {
    const {
        searchResults
    } = store.getState().search
    try{
        let results = yield call(axios.get, `/search?search=${data.search}&skip=${data.skip}&limit=${data.limit}&type=${data.type}`)
        
        let userArray = []
        let projectArray = []
        userArray =[...searchResults.user]
        projectArray =[...searchResults.project]
        if(data.type !== 0){
            results.data.user.forEach(e => {
                if (userArray.findIndex(i => i._id === e._id) === -1) {
                    userArray.push(e)
                }
            })
            results.data.project.forEach(e => {
                if (projectArray.findIndex(i => i._id === e._id) === -1) {
                    projectArray.push(e)
                }
            })
        } else{
            userArray = results.data.user;
            projectArray = results.data.project
        }
        yield put({
            type: SET_SEARCH_BY_TYPE,
            searchResults: {
                user: userArray,
                project: projectArray
            }
        })
    }catch(error){
        yield(put(errorHandler(error)))
    } finally {

    }
}

export function* search() {
    yield takeLatest(GET_SEARCH_BY_TYPE, getSearchByType)
}