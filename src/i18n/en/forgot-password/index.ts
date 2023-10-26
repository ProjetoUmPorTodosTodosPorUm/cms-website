import type { NamespaceForgotPasswordTranslation } from '../../i18n-types'

const en_forgot_password = {
	pageTitle: 'Retrieve Account',

	// by step
	authModal: [
		{
			title: 'Retrieve Account',
			subTitle: 'Please enter your email',
			buttonText: 'Next'
		},
		{
			title: 'Verification',
			subTitle: 'Enter your token',
			buttonText: 'Validate'
		},
		{
			title: 'Last Step',
			subTitle: 'Your new password please',
			buttonText: 'Save New Password'
		}
	],

	inputs: {
		emailLabel: 'E-mail',
		tokenLabel: 'Token',
		passwordLabel: 'Password',
		confirmPasswordLabel: 'Repeat the password'
	},

	yupMessages: {
		tokenMatch: 'Only alphanumeric digits are valid',
		tokenInvalid: 'Invalid token!',
		confirmPassword: 'Passwords must be the same'
	},

	links: {
		loginText: 'Login',
		signupText: 'Create Account'
	}
} satisfies NamespaceForgotPasswordTranslation

export default en_forgot_password
