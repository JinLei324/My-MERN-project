import { NOTIFICATION_TOGGLE, NOTIFICATION_RESEND } from './types'

export const toggleNotification = data => ({
	type: NOTIFICATION_TOGGLE,
	payload: data
})

export const resendMail = email => ({
	type: NOTIFICATION_RESEND,
	email
})
