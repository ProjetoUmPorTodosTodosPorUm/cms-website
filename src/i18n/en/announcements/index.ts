import type { NamespaceAnnouncementsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		titleLabel: 'Title',
		messageLabel: 'Message',
		attachmentsLabel: 'Attachments',
		fixedLabel: 'Fixed',
		yes: 'Yes',
		no: 'No'
	},
	pageTitle: 'Announcements'
}

const en_announcements = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Announcements',
			buttonText: 'Add Announcement'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Add Announcement',
			buttonText: 'Save'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Edit Announcement',
			buttonText: 'Save'
		},
		inputs: shared.labels
	}
} satisfies NamespaceAnnouncementsTranslation

export default en_announcements
