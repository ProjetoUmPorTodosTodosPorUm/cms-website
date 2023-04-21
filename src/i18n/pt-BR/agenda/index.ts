import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        titleLabel: 'Título',
        messageLabel: 'Mensagem',
        attachmentsLabel: 'Anexos',
        dateLabel: 'Data',
    },
    pageTitle: 'Agenda'
}

const pt_BR_agenda = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Agenda',
            buttonText: 'Adicionar Evento',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Evento',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Evento',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_agenda