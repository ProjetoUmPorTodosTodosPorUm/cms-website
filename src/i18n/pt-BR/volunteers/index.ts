import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        nameLabel: 'Nome',
        firstNameLabel: 'Primeiro Nome',
        lastNameLabel: 'Último Nome',
        emailLabel: 'E-mail',
        joinedDateLabel: 'Data de Admissão',
        occupationLabel: 'Ocupação',
        churchLabel: 'Igreja',
        priestLabel: 'Pastor',
        observationLabel: 'Observação'
    },
    pageTitle: 'Voluntários',
    occupations: {
        president: 'Presidente',
        vicePresident: 'Vice-Presidente',
        geralCoordinator: 'Coordenador Geral',
        coordinator01: 'Coordenador 01',
        counselor01: 'Conselheiro 01',
        counselor02: 'Conselheiro 02',
        counselor03: 'Conselheiro 03',
        webMaster: 'Web Master',
        treasurer01: 'Tesoureiro 01',
        treasurer02: 'Tesoureiro 02',
        academicInstructor01: 'Instrutor Acadêmico 01',
        academicInstructor02: 'Instrutor Acadêmico 02',
        executiveSecretary: 'Secretário(a) Executiv(o)',
        auxiliarySecretary: 'Secretário(a) Auxiliar',
        coordinator02: 'Coordenador 02',
        infieldCoordinator: 'Coordenador Interno',
        outfieldCoordinator: 'Coordenador Externo',
        collector: 'Coletor',
        supportService: 'Serviço de Apoio'
    },
    profilePic: {
        altText: 'Imagem de Perfil',
        editText: 'Editar'
    }
}

const pt_BR_volunteers = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Voluntários',
            buttonText: 'Adicionar Voluntário',
        },
        collectionHeader: shared.labels,
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Voluntário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        occupations: shared.occupations,
        profilePic: shared.profilePic,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Voluntário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        occupations: shared.occupations,
        profilePic: shared.profilePic,
    }

} as BaseTranslation

export default pt_BR_volunteers