import type { NamespaceUsersTranslation } from '../../i18n-types'

const shared = {
	labels: {
		nameLabel: 'Name',
		firstNameLabel: 'First Name',
		lastNameLabel: 'Last Name',
		emailLabel: 'E-mail',
		roleLabel: 'Role',
		lastAccessLabel: 'Last Access',
	},
	pageTitle: 'Users',
	roles: {
		volunteer: 'Volunteer',
		admin: 'Admin',
		webMaster: 'Web Master'
	},
	profilePic: {
		altText: 'Profile pic',
		editText: 'Edit'
	}
}

const en_users = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Users',
			buttonText: 'Add User',
		},
		collectionHeader: shared.labels,
		lastNamePlaceholder: '(not informed)',
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add User',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		roles: shared.roles,
		profilePic: shared.profilePic,
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit User',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		roles: shared.roles,
		profilePic: shared.profilePic,
	}

} satisfies NamespaceUsersTranslation

export default en_users
