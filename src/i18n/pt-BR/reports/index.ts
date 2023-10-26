import type { BaseTranslation } from '../../i18n-types'

const shared = {
	labels: {
		titleLabel: 'Título',
		textLabel: 'Texto',
		shortDescriptionLabel: 'Descrição Curta',
		attachmentsLabel: 'Anexos',
		monthLabel: 'Mês',
		yearLabel: 'Ano',
		typeLabel: 'Tipo'
	},
	pageTitle: 'Relatórios',
	reportTypes: {
		ordinary: 'Comum',
		semester: 'Semestral',
		annual: 'Anual'
	}
}

const pt_BR_reports = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Relatórios',
			buttonText: 'Adicionar Relatório'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Adicionar Relatório',
			buttonText: 'Salvar'
		},
		inputs: shared.labels,
		reportTypes: shared.reportTypes
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Editar Relatório',
			buttonText: 'Salvar'
		},
		inputs: shared.labels,
		reportTypes: shared.reportTypes
	}
} as BaseTranslation

export default pt_BR_reports
