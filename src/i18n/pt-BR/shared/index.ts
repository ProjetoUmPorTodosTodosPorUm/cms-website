import type { BaseTranslation } from '../../i18n-types'

const pt_BR_shared = {
    // List Pages
    collectionHeader: {
        createdAtLabel: 'Criado Em',
        updatedAtLabel: 'Atualizado Em',
        deletedLabel: 'Deletado Em'
    },

    remove: {
        user: 'Você deseja remover a conta de {email:string}?',
        file: 'Você deseja remover o arquivo {name:string}?',
        log: 'Você deseja remover o log de {createdAt: string}?',
        agenda: 'Você deseja remover o evento {title:string}?',
        announcement: 'Você deseja remover o anúncio {title:string}?',
        testimonial: 'Você deseja remover o testemunho de {name:string}?',
        report: 'Você deseja remover o relatório {title:string}?',
        offerorFamily: 'Você deseja remover a família ofertante representada pelo(a) {name:string}?',
        welcomedFamily: 'Você deseja remover a família acolhida representada pelo(a) {name:string}?',
        field: 'Você deseja remover o campo missionário {designation:string}?',
        church: 'Você deseja remover a igreja {name:string}?',
        collaborator: 'Você deseja remover o colaborador {title:string}?',
        collectedOffer: 'Você deseja remover a oferta coletada do mês {month:number} e ano {year:number}?',
        volunteer: 'Você deseja remover o voluntário {name:string}?',
    },

    isStatusTransform: {
        true: 'Sim',
        false: 'Não'
    },

    // Add && Edit Pages
    yup: {
        required: '{field:string} é um campo obrigatório.',
        oneOf: 'Você deve escoher um dentre os valores: {enums:string}.',
        min: '{field:string} deve ter no mínimo {length:number} caracteres.',
        max: '{field:string} deve ter no máximo {length:number} caracteres.',
        minNumber: '{field:string} deve ser no mínimo {value:number}.',
        maxNumber: '{field:string} deve ser no máximo {value:number}.',
        number: '{field:string} deve ser um número válido.',
        integer: '{field:string} deve ser um número inteiro.',
        email: '{field:string} deve ser um e-mail válido.'
    },

    axios: {
        fileSizeError: 'Os arquivos são muito grandes!',
        serverNotAvailable: 'Servidor não está disponível'
    },

    inputs: {
        fieldLabel: 'Campo Missionário'
    },

} as BaseTranslation

export default pt_BR_shared