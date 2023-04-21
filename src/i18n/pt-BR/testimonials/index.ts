import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        nameLabel: 'Nome',
        emailLabel: 'E-mail',
        textLabel: 'Texto',
    },
    pageTitle: 'Testemunhos',
}

const pt_BR_testimonials = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Testemunhos',
            buttonText: 'Adicionar Testemunho',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Testemunho',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Testemunho',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_testimonials