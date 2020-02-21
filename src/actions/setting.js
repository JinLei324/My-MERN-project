import {
	CHANGE_PASSWORD_SETTING,
	CHANGE_EMAIL_SETTING,
	CHANGE_AVATAR_SETTING,
	CHANGE_STUDENT_SETTING,
	CHANGE_DONOR_SETTING,
	CHANGE_NONPROFIT_SETTING,
	CHANGE_PRIVACY_SETTING
} from './types'

export const changePasswordSetting = ({ password, newPassword }) => ({
	type: CHANGE_PASSWORD_SETTING,
	password,
	newPassword
})

export const changeEmailSetting = ({ email, password }) => ({
	type: CHANGE_EMAIL_SETTING,
	email,
	password
})

export const changeAvatarSetting = ({ avatar }) => ({
	type: CHANGE_AVATAR_SETTING,
	avatar
})

export const changeStudentSetting = ({
	firstName,
	lastName,
	birthday,
	userID,
	donorAddress,
	aboutUs,
	role
}) => ({
	type: CHANGE_STUDENT_SETTING,
	userID,
	firstName,
	lastName,
	birthday,
	donorAddress,
	aboutUs,
	role
})

export const changeDonorSetting = ({
	firstName,
	lastName,
	birthday,
	userID,
	donorAddress,
	aboutUs,
	role
}) => ({
	type: CHANGE_DONOR_SETTING,
	userID,
	firstName,
	lastName,
	birthday,
	donorAddress,
	aboutUs,
	role
})


export const changeNonprofitSetting = ({
	userID,
	ein,
	billingAddress,
	address,
	companyName,
	role
}) => ({
	type: CHANGE_NONPROFIT_SETTING,
	userID,
	ein,
	billingAddress,
	address,
	companyName,
	role
})

export const changePrivacySetting = data =>  ({
	type: CHANGE_PRIVACY_SETTING,
	data
})