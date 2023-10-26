import type { BaseTranslation } from '../../i18n-types'

const shared = {
	labels: {
		ipLabel: 'IP',
		methodLabel: 'METHOD',
		urlLabel: 'URL',
		bodyLabel: 'Body',
		filesLabel: 'Arquivos',
		queryLabel: 'Query',
		statusCodeLabel: 'Código de Status',
		userLabel: 'Usuário'
	},
	pageTitle: 'Logs'
}

const pt_BR_logs = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Logs'
		},
		collectionHeader: shared.labels
	}
} as BaseTranslation

export default pt_BR_logs
