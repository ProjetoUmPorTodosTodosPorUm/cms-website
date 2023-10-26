import type { NamespaceLogsTranslation } from '../../i18n-types'

const shared = {
	labels: {
		ipLabel: 'IP',
		methodLabel: 'METHOD',
		urlLabel: 'URL',
		bodyLabel: 'Body',
		filesLabel: 'Files',
		queryLabel: 'Query',
		statusCodeLabel: 'Status Code',
		userLabel: 'User'
	},
	pageTitle: 'Logs'
}

const en_logs = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Logs'
		},
		collectionHeader: shared.labels
	}
} satisfies NamespaceLogsTranslation

export default en_logs
