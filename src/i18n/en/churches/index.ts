import type { NamespaceChurchesTranslation } from '../../i18n-types'

const shared = {
	labels: {
		nameLabel: 'Name',
		descriptionLabel: 'Description',
		imagesLabel: 'Images',
		typeLabel: 'Type'
	},
	pageTitle: 'Churches in Unity',
	churchTypes: {
		pioneer: 'Pioneer',
		expansion: 'Expansionist',
		support: 'Supporter',
		responsible: 'Responsible'
	}
}

const en_churches = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Churches in Unity',
			buttonText: 'Add Church in Unity',
		},
		collectionHeader: shared.labels,
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Church in Unity',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		churchTypes: shared.churchTypes,
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Church in Unity',
			buttonText: 'Save',
		},
		inputs: shared.labels,
		churchTypes: shared.churchTypes,
	}

} satisfies NamespaceChurchesTranslation

export default en_churches
