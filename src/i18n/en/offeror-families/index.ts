import type { NamespaceOfferorFamiliesTranslation } from '../../i18n-types'

const shared = {
	labels: {
		representativeLabel: 'Representative',
		commitmentLabel: 'Commitment',
		churchLabel: 'Church',
		groupLabel: 'Group',
	},
	pageTitle: 'Offeror Families',
	groups: {
		church: 'Church',
		community: 'Community',
		external: 'External'
	}
}

const en_offeror_families = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Offeror Families',
			buttonText: 'Add Offeror Family',
		},
		collectionHeader: shared.labels,
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Offeror Family',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		groups: shared.groups
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Offeror Family',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		groups: shared.groups
	}

} satisfies NamespaceOfferorFamiliesTranslation

export default en_offeror_families
