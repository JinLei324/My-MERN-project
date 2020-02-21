import {
	SEND_USER_SUBSCRIBE,
	SEND_USER_CONTACT,
	CLEAR_USER_SUBSCRIBE,
	CLEAR_USER_CONTACT,
	CANCEL_VERIFICATION,
	SHOWN_APPROVE_MESSAGE,
	UPLOAD_PROFILE_PICTURE,
	DELETE_PROFILE_PICTURE,
	GET_USER_LIST,
	CLEAR_USER_LIST,
	SET_DONOR_AVATAR,
	UPDATE_FIRST_TIME,
	GET_STRIPE_ACCOUNT_INFO,
	SUBMIT_REVIEW_PROFILE,
	GET_REIVEW_LIST,
	CLEAR_REVIEW_LIST,
	GET_DONOR_GIVE_INFO,
	SET_VERIFY_STEP,
	INVITE_NONPROFIT,
	PAYOUT_STRIPE,
	SET_IS_CLAIMED,
	WITHDRAW_AMOUNT,
	GET_COMMUNITY_LIST,
	CLEAR_COMMUNITY_LIST
} from './types'

export const sendUserSubscribe = data => ({
	type: SEND_USER_SUBSCRIBE,
	...data
})

export const sendUserContact = data => ({
	type: SEND_USER_CONTACT,
	...data
})

export const clearUserSubscribe = () => ({
	type: CLEAR_USER_SUBSCRIBE
})

export const clearUserContact = () => ({
	type: CLEAR_USER_CONTACT
})


export const cancelVerification = () => ({
	type: CANCEL_VERIFICATION
})

export const shownApproveMessage = () => ({
	type: SHOWN_APPROVE_MESSAGE
})

export const uploadProfilePicture = data => ({
	type: UPLOAD_PROFILE_PICTURE,
	...data
})

export const deleteProfilePicture = () => ({
	type: DELETE_PROFILE_PICTURE
})

export const getUserList = data => ({
	type: GET_USER_LIST, data
})

export const clearUserList = () => ({
	type: CLEAR_USER_LIST
})

export const setDonorAvatar = data => ({
	type: SET_DONOR_AVATAR, data
})

export const updateFirstTime = () => ({
	type: UPDATE_FIRST_TIME
})

export const getStripeAccount = data => ({
	type: GET_STRIPE_ACCOUNT_INFO,
	data
})

export const submitReview = data => ({
	type: SUBMIT_REVIEW_PROFILE,
	data
})

export const getReviews = data => ({
	type: GET_REIVEW_LIST,
	data
})

export const clearReviews = () => ({
	type: CLEAR_REVIEW_LIST
})

export const getDonorGiveInfo = data => ({
	type: GET_DONOR_GIVE_INFO,
	data
})

export const setVerifyStep = step => ({
	type: SET_VERIFY_STEP,
	step
})

export const inviteNonprofit = inviteName => ({
	type: INVITE_NONPROFIT,
	inviteName
})

export const payoutStripe = data => ({
	type: PAYOUT_STRIPE,
	data
})

export const setIsClaimed = data => ({
	type: SET_IS_CLAIMED,
	data
})

export const withdrawAmount = data => ({
	type: WITHDRAW_AMOUNT,
	data
})

export const getCommunityList = data => ({
	type: GET_COMMUNITY_LIST, data
})

export const clearCommunityList = () => ({
	type: CLEAR_COMMUNITY_LIST
})