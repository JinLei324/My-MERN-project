const serverErrors = {
	400: 'Validation error',
	412: 'Please verify your user',
	1002: 'This email is already registered',
	1012: 'Email is not registered',
	1022: "We don't recognize this email or password",
	1023: 'Please, check your inbox for verification link',
	1024: '!!!!!REDIRECT!!!!!',
	1032: 'Oops, this link is expired',
	1042: 'Token not found',
	1052: "We don't recognize this email",
	1053: 'You have no permission for this operation',
	1081: "We don't recognize this password",
	1071: "We don't recognize this password",
	1079: 'This account email already exists',
	2109: 'You have already follow this user',
	3103: "This project starts within the next 24 hours. You are unable to make changes to projects within 24 hours of their start times."
}

export default function getErrorText(error) {
	return error.response
		? error.response.data.message ||
		  serverErrors[error.response.headers['x-code-error']] ||
		  serverErrors[error.response.status]
		: 'Server error'
}
