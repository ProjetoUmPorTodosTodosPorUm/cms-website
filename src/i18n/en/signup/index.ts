import type { NamespaceSignupTranslation } from '../../i18n-types'

const en_signup = {
	pageTitle: 'Create Account',

	// by step
	authModal: [
		{
			title: 'Create Account',
			subTitle: 'Please enter your email',
			buttonText: 'Next',
		},
		{
			title: 'Verification',
			subTitle: 'Enter your token',
			buttonText: 'Validate',
		},
		{
			title: 'Last Step',
			subTitle: 'Fill with your data',
			buttonText: 'Create Account',
		},
	],


	inputs: {
		emailLabel: 'E-mail',
		tokenLabel: 'Token',
		firstNameLabel: 'First Name',
		lastNameLabel: 'Last Name',
		passwordLabel: 'Password',
		confirmPasswordLabel: 'Reeat the password'
	},

	yupMessages: {
		tokenMatch: 'Only alphanumeric digits are valid',
		tokenInvalid: 'Invalid token!',
		confirmPassword: 'Passwords must be the same'
	},

	links: {
		loginText: 'Login',
		forgotPasswordText: 'Retrieve Account'
	}

} satisfies NamespaceSignupTranslation

export default en_signup
