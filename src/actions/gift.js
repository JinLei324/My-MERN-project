import {
	CREATE_GIFT
} from './types'

export const createGift = data => ({
	type: CREATE_GIFT,
	data
})