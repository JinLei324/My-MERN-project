import { SET_SEARCH_BY_TYPE, CLEAR_SEARCH_BY_TYPE } from "../actions/types";

const initialState = {
    searchResults: {
        user: [],
        project: []
    }
}

export default (state = initialState, action) => {
    
    if(action.type === SET_SEARCH_BY_TYPE)
        return {
            ...state,
            searchResults: action.searchResults
        }
    if(action.type === CLEAR_SEARCH_BY_TYPE)
        return {
            ...state,
            searchResults: {
                user: [],
                project: []
            }
        }

    return state
}
