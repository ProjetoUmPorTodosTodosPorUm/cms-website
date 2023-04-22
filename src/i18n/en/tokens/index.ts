import type { NamespaceTokensTranslation } from '../../i18n-types'

const shared = {
	labels: {
		tokenLabel: 'Token',
		emailLabel: 'E-mail',
		usedLabel: 'Used',
		typeLabel: 'Type',
		payloadLabel: 'Payload',
		expirationLabel: 'Expiration',
	},
	pageTitle: 'Tokens',
}

const en_tokens = {
	list: {
		pageTitle: shared.pageTitle,
		appHeader: {
			name: 'Tokens',
		},
		collectionHeader: shared.labels,
	},

} satisfies NamespaceTokensTranslation

export default en_tokens
