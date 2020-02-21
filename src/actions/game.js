import {
	GET_QUESTION,
	SUBMIT_ANSWER,
	GET_GAME_STATS
} from './types'

export const getQuestion = () => ({
	type: GET_QUESTION
})

export const getGameStats = () =>({
	type: GET_GAME_STATS
})

export const submitAnswer = data => ({
	type: SUBMIT_ANSWER,
	...data
})