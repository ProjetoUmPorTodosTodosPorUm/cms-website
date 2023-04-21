import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        continentLabel: 'Continente',
        countryLabel: 'País',
        stateLabel: 'Estado',
        abbreviationLabel: 'Abreviação',
        designationLabel: 'Designação',
        collectionPointsLabel: 'Pontos de Coleta',
        streetRelationLabel: 'Relação de Ruas',
    },
    pageTitle: 'Campos Missionários',
}

const pt_BR_fields = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Campos Missionários',
            buttonText: 'Adicionar Campo Missionário',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Campo Missionário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Campo Missionário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_fields