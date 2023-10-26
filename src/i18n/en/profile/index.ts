import type { NamespaceProfileTranslation } from '../../i18n-types'

const en_profile = {
	pageTitle: 'Profile',

	appHeader: {
		name: 'Profile',
		buttonText: 'Save'
	},

	roles: {
		volunteer: 'Volunteer',
		admin: 'Admin',
		webMaster: 'Web Master'
	},

	inputs: {
		firstNameLabel: 'First Name',
		lastNameLabel: 'Last Name',
		emailLabel: 'E-mail',
		passwordLabel: 'Password',
		confirmPasswordLabel: 'Repeat the password',
		roleLabel: 'Role'
	},

	yupMessages: {
		confirmPassword: 'Passwords must be the same'
	},

	profilePic: {
		altText: 'Profile pic',
		editText: 'Edit'
	}
} satisfies NamespaceProfileTranslation

export default en_profile
