import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        titleLabel: 'Título',
        descriptionLabel: 'Descrição',
        imageLabel: 'Imagem',
    },
    pageTitle: 'Colaboradores',
}

const pt_BR_collaborators = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Colaboradores',
            buttonText: 'Adicionar Colaborador',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Colaborador',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Colaborador',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_collaborators