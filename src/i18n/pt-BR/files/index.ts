import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        nameLabel: 'Nome',
        mimeTypeLabel: 'MimeType',
        sizeLabel: 'Tamanho',
    },
    pageTitle: 'Arquivos',
}

const pt_BR_files = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Arquivos',
        },
        collectionHeader: shared.labels,
    },
} as BaseTranslation

export default pt_BR_files