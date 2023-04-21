import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        tokenLabel: 'Token',
        emailLabel: 'E-mail',
        usedLabel: 'Usado',
        typeLabel: 'Tipo',
        payloadLabel: 'Payload',
        expirationLabel: 'Expiração',
    },
    pageTitle: 'Tokens',
}

const pt_BR_tokens = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Tokens',
        },
        collectionHeader: shared.labels,
    },

} as BaseTranslation

export default pt_BR_tokens