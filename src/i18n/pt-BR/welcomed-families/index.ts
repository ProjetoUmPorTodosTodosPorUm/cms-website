import type { BaseTranslation } from '../../i18n-types'

const shared = {
	labels: {
		representativeLabel: 'Representante',
		observationLabel: 'Observação'
	},
	pageTitle: 'Famílias Acolhidas'
}

const pt_BR_welcomed_families = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Famílias Acolhidas',
			buttonText: 'Adicionar Família Acolhida'
		},
		collectionHeader: shared.labels
	},

	add: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Adicionar Família Acolhida',
			buttonText: 'Salvar'
		},
		inputs: shared.labels
	},

	edit: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Editar Família Acolhida',
			buttonText: 'Salvar'
		},
		inputs: shared.labels
	}
} as BaseTranslation

export default pt_BR_welcomed_families
