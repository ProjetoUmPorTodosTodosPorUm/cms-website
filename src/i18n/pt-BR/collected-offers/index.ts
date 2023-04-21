import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        monthLabel: 'Mês',
        yearLabel: 'Ano',
        foodQntLabel: 'Mantimentos (Qnt.)',
        monetaryValueLabel: 'Valor',
        othersQntLabel: 'Outros (Qnt.)'
    },
    pageTitle: 'Ofertas Coletadas',
}

const pt_BR_collected_offers = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Ofertas Coletadas',
            buttonText: 'Adicionar Ofertas Coletadas',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Ofertas Coletadas',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Ofertas Coletadas',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
    }

} as BaseTranslation

export default pt_BR_collected_offers