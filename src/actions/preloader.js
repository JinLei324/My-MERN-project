import { PRELOADER_TOGGLE } from './types'

export const togglePreloader = data => ({
	type: PRELOADER_TOGGLE,
	payload: data
})
