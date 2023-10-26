import type { NamespaceAgendaTranslation } from '../../i18n-types'

const shared = {
	labels: {
		titleLabel: 'Title',
		messageLabel: 'Message',
		attachmentsLabel: 'Attachments',
		dateLabel: 'Date'
	},
	pageTitle: 'Agenda'
}

const en_agenda = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Agenda',
			buttonText: 'Add Event'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Event',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Event',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceAgendaTranslation

export default en_agenda
