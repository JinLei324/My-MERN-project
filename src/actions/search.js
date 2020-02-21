import { GET_SEARCH_BY_TYPE, CLEAR_SEARCH_BY_TYPE } from "./types";


export const getSearchByType = data => ({
    type: GET_SEARCH_BY_TYPE,
    data
})

export const clearSearchByType = () => ({
    type: CLEAR_SEARCH_BY_TYPE
})