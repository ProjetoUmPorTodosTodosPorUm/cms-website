import type { NamespaceFilesTranslation } from '../../i18n-types'

const shared = {
	labels: {
		nameLabel: 'Name',
		mimeTypeLabel: 'MimeType',
		sizeLabel: 'Size',
	},
	pageTitle: 'Files',
}

const en_files = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Files',
		},
		collectionHeader: shared.labels,
	},

} satisfies NamespaceFilesTranslation

export default en_files
