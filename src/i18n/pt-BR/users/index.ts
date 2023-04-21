import type { BaseTranslation } from '../../i18n-types'

const shared = {
    labels: {
        nameLabel: 'Nome',
        firstNameLabel: 'Primeiro Nome',
        lastNameLabel: 'Último Nome',
        emailLabel: 'E-mail',
        roleLabel: 'Acesso',
        lastAccessLabel: 'Último Acesso',
    },
    pageTitle: 'Usuários',
    roles: {
        volunteer: 'Voluntário',
        admin: 'Admin',
        webMaster: 'Web Master'
    },
    profilePic: {
        altText: 'Imagem de Perfil',
        editText: 'Editar'
    }
}

const pt_BR_users = {
    list: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Usuários',
            buttonText: 'Adicionar Usuário',
        },
        collectionHeader: shared.labels,
        lastNamePlaceholder: '(não informado)',
    },

    add: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Adicionar Usuário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        roles: shared.roles,
        profilePic: shared.profilePic,
    },

    edit: {
        pageTitle: shared.pageTitle,
        appHeader: {
            name: 'Editar Usuário',
            buttonText: 'Salvar',
        },
        inputs: shared.labels,
        roles: shared.roles,
        profilePic: shared.profilePic,
    }

} as BaseTranslation

export default pt_BR_users