const fields = {
	email: [
		{
			rule: /\S+/,
			message: 'Please, enter your email'
		},
		{
			rule: /\S+@\S+\.\S+/,
			message: 'Please, enter the valid email'
		}
	],
	newEmail: [
		{
			rule: /\S+/,
			message: 'Please, enter your email'
		},
		{
			rule: /\S+@\S+\.\S+/,
			message: 'Please, enter the valid email'
		}
	],
	school: [
		{
			rule: /\S+/,
			message: 'Please, choose your school'
		}
	],
	firstName: [
		{
			rule: /\S+/,
			message: "First name can't be blank"
		}
	],
	lastName: [
		{
			rule: /\S+/,
			message: "Last name can't be blank"
		}
	],
	company: [
		{
			rule: /\S+/,
			message: "Company can't be blank"
		}
	],
	// address: [
	// 	{
	// 		rule: /\S+/,
	// 		message: "Address can't be blank"
	// 	}
	// ],
	billing: [
		{
			rule: /\S+/,
			message: "Billing can't be blank"
		}
	],
	ein: [
		{
			rule: /\S+/,
			message: "EIN can't be blank"
		},
		{
			rule: /^[1-9]\d?-\d{7}$/,
			message: 'EIN is not valid'
		}
	],
	// birthday: [
	// 	{
	// 		rule: /\S+/,
	// 		message: "Birthday can't be blank"
	// 	}
	// ],
	interests: [
		{
			rule: /\S+/,
			message: "Interests can't be blank"
		}
	],
	password: [
		{
			rule: /\S+/,
			message: 'Please, enter your password'
		},
		{
			rule: /\S{6,}/,
			message: 'Password should have 6 or more symbols'
		},
		{
			rule: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
			message: 'Password is too easy'
		}
	],
	passwordConfirmation: [
		{
			rule: /\S+/,
			message: 'Please, enter your password confirmation'
		},
		// {
		// 	rule: /\S{6,}/,
		// 	message: 'Password should have 6 or more symbols'
		// },
		// {
		// 	rule: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,}$/,
		// 	message: 'Password is too easy'
		// }
	],
	companyName: [
		{
			rule: /\S+/,
			message: "Company can't be blank"
		}
	],
	billingAddress: [
		{
			rule: /\S+/,
			message: "Billing can't be blank"
		}
	],
	donorAddress: [
		{
			rule: /\S+/,
			message: "Address can't be blank"
		}
	],
	oldPassword: [
		{
			rule: /\S+/,
			message: 'Please, enter your password'
		},
		{
			rule: /\S{6,}/,
			message: 'Password should have 6 or more symbols'
		},
		{
			rule: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
			message: 'Password is too easy'
		}
	],
	newPassword: [
		{
			rule: /\S+/,
			message: 'Please, enter your new password'
		},
		{
			rule: /\S{6,}/,
			message: 'Password should have 6 or more symbols'
		},
		{
			rule: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
			message: 'Password is too easy'
		}
	],
	confirmPassword: [
		{
			rule: /\S+/,
			message: 'Please, enter your password confirmation'
		},
		// {
		// 	rule: /\S{6,}/,
		// 	message: 'Password should have 6 or more symbols'
		// },
		// {
		// 	rule: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,}$/,
		// 	message: 'Password is too easy'
		// }
	],
	currentPassword: [
		{
			rule: /\S+/,
			message: 'Please, enter your password'
		},
		{
			rule: /\S{6,}/,
			message: 'Password should have 6 or more symbols'
		},
		{
			rule: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/,
			message: 'Password is too easy'
		}
	],
	projectFileCreate: [
		{
			rule: /\S+/,
			message: 'Please choose cover photo for your project'
		}
	],
	projectTitleCreate: [
		{
			rule: /^[\d\s\w\S]{2,99}$/,
			message: 'Please, enter correct project title'
		}
	],
	projectDescriptionCreate: [
		{
			rule: /^[\d\s\w\S]/,
			message: 'Please, enter correct project description'
		}
	],
	projectNeedsTextCreate: [
		{
			rule: /^[\d\s\w\S]{2,49}$/,
			message: 'Please, enter correct kind of activity'
		}
	],
	projectLocationField: [
		{
			rule: /\S+/,
			message: "Location can't be blank"
		}
	],
	projectBillingField: [
		{
			rule: /\S+/,
			message: "Billing can't be blank"
		}
	],
	projectNeedsCountCreate: [
		{
			rule: /\S+/,
			message: "Can't be blank"
		}
	],
	projectLocationRange: [
		{
			rule: /\S+/,
			message: "Location range can't be blank"
		},
		{
			rule: /^\d+$/,
			message: "Location range should be integer"
		}
	]
}

export default (inputName, inputValue) => {
	let errors = []
	fields[inputName] &&
		fields[inputName].forEach(elem => {
			if (!elem.rule.test(inputValue)) errors.push(elem.message)
		})
	return errors
}
