import type { NamespaceCollectedOffersTranslation } from '../../i18n-types'

const shared = {
	labels: {
		monthLabel: 'Month',
		yearLabel: 'Year',
		foodQntLabel: 'Provisions (Qnt.)',
		monetaryValueLabel: 'Monetary',
		othersQntLabel: 'Others (Qnt.)'
	},
	pageTitle: 'Collected Offers'
}

const en_collected_offers = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Collected Offers',
			buttonText: 'Add Collected Offers'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Collected Offers',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Collected Offers',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceCollectedOffersTranslation

export default en_collected_offers
