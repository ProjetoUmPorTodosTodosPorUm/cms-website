import type { NamespaceFieldsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		continentLabel: 'Continent',
		countryLabel: 'Country',
		stateLabel: 'State',
		abbreviationLabel: 'Abbreviation',
		designationLabel: 'Designation',
		collectionPointsLabel: 'Collection Points',
		streetRelationLabel: 'Street Relation'
	},
	pageTitle: 'Missionary Fields'
}

const en_fields = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Missionary Fields',
			buttonText: 'Add Missionary Field'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Missionary Field',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Missionary Field',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceFieldsTranslation

export default en_fields
