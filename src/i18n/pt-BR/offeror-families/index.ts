import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        representativeLabel: 'Representante',
        commitmentLabel: 'Compromisso',
        churchLabel: 'Igreja',
        groupLabel: 'Grupo',
    },
    pageTitle: 'Famílias Ofertantes',
    groups: {
        church: 'Igreja',
        community: 'Comunidade',
        external: 'Externo'
    }
}

const pt_BR_offeror_families = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Famílias Ofertantes',
            buttonText: 'Adicionar Família Ofertante',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Família Ofertante',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        groups: shared.groups
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Família Ofertante',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        groups: shared.groups
    }

} as BaseTranslation

export default pt_BR_offeror_families