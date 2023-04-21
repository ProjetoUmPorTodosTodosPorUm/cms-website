import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        titleLabel: 'Título',
        messageLabel: 'Mensagem',
        attachmentsLabel: 'Anexos',
        fixedLabel: 'Fixado',
        yes: 'Sim',
        no: 'Não'
    },
    pageTitle: 'Anúncios'
}

const pt_BR_announcements = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Anúncios',
            buttonText: 'Adicionar Anúncio',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Anúncio',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Anúncio',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_announcements