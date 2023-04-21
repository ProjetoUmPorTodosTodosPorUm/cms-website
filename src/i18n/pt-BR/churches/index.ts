import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        nameLabel: 'Nome',
        descriptionLabel: 'Descrição',
        imagesLabel: 'Imagens',
        typeLabel: 'Tipo'
    },
    pageTitle: 'Igrejas em Unidade',
    churchTypes: {
        pioneer: 'Pioneira',
        expansion: 'Expansionista',
        support: 'Apoio',
        responsible: 'Responsável'
    }
}

const pt_BR_churches = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Igrejas em Unidade',
            buttonText: 'Adicionar Igreja em Unidade',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Igreja em Unidade',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        churchTypes: shared.churchTypes,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Igreja em unidade',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        churchTypes: shared.churchTypes,
    }

} as BaseTranslation

export default pt_BR_churches