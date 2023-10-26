import type { NamespaceReportsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		titleLabel: 'Title',
		textLabel: 'Text',
		shortDescriptionLabel: 'Short Description',
		attachmentsLabel: 'Attachments',
		monthLabel: 'Month',
		yearLabel: 'Year',
		typeLabel: 'Type'
	},
	pageTitle: 'Reports',
	reportTypes: {
		ordinary: 'Ordinary',
		semester: 'Semester',
		annual: 'Annual'
	}
}

const en_reports = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Reports',
			buttonText: 'Add Report'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Report',
			buttonText: 'Save'
		},
		inputs: shared.labels,
		reportTypes: shared.reportTypes
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Report',
			buttonText: 'Save'
		},
		inputs: shared.labels,
		reportTypes: shared.reportTypes
	}
} satisfies NamespaceReportsTranslation

export default en_reports
