import {
    SET_QUESTION,
    SET_GAME_STATS
} from '../actions/types'

const initState = {
    answer: '',
    question: {},
    stats: {}
}

export default function(state = initState, action) {
    const { type } = action    
    if (SET_QUESTION === type) {
        return {
            ...state,
            question: action.question
        }
    }
    if(SET_GAME_STATS === type){
        return{
            ...state,
            stats: action.stats
        }
    }
	return state
}
