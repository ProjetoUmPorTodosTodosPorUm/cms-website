import type { NamespaceWelcomedFamiliesTranslation } from '../../i18n-types'

const shared = {
	labels: {
		representativeLabel: 'Representative',
		observationLabel: 'Observation'
	},
	pageTitle: 'Welcomed Families'
}

const en_welcomed_families = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Welcomed Families',
			buttonText: 'Add Welcomed Family'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Welcomed Family',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Welcomed Family',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceWelcomedFamiliesTranslation

export default en_welcomed_families
