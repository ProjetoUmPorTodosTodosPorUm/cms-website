import type { NamespaceCollaboratorsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		titleLabel: 'Title',
		descriptionLabel: 'Description',
		imageLabel: 'Image'
	},
	pageTitle: 'Collaborators'
}

const en_collaborators = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Collaborators',
			buttonText: 'Add Collaborator'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Collaborator',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Collaborator',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceCollaboratorsTranslation

export default en_collaborators
