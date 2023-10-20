import type { BaseTranslation } from '../../i18n-types'

const pt_BR_shared = {
    // List Pages
    collectionHeader: {
        createdAtLabel: 'Criado Em',
        updatedAtLabel: 'Atualizado Em',
        deletedLabel: 'Deletado Em'
    },

    remove: {
        users: 'Você deseja remover a conta de {email:string}?',
        files: 'Você deseja remover o arquivo {name:string}?',
        logs: 'Você deseja remover o log de {createdAt:string}?',
        agenda: 'Você deseja remover o evento {title:string}?',
        announcements: 'Você deseja remover o anúncio {title:string}?',
        testimonials: 'Você deseja remover o testemunho de {name:string}?',
        reports: 'Você deseja remover o relatório {title:string}?',
        'offeror-families': 'Você deseja remover a família ofertante representada pelo(a) {representative:string}?',
        'welcomed-families': 'Você deseja remover a família acolhida representada pelo(a) {representative:string}?',
        fields: 'Você deseja remover o campo missionário {designation:string}?',
        churches: 'Você deseja remover a igreja {name:string}?',
        collaborators: 'Você deseja remover o colaborador {title:string}?',
        'collected-offers': 'Você deseja remover a oferta coletada de {month:number}/{year:number}?',
        volunteers: 'Você deseja remover o voluntário(a) {firstName:string}?',
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

    inputFile: {
		chooseFile: 'Escolher Arquivo',
        chooseFiles: 'Escolher Arquivos'
	}

} as BaseTranslation

export default pt_BR_shared