import type { BaseTranslation } from '../../i18n-types'

const pt_BR_signup = {
    pageTitle: 'Criar Conta',

    // by step
    authModal: [
        {
            title: 'Criar Conta',
            subTitle: 'Por favor, insira seu e-mail',
            buttonText: 'Próximo',
        },
        {
            title: 'Verificação',
            subTitle: 'Digite o seu token',
            buttonText: 'Validar',
        },
        {
            title: 'Último Passo',
            subTitle: 'Preencha os dados faltantes',
            buttonText: 'Criar Conta',
        },
    ],


    inputs: {
        emailLabel: 'E-mail',
        tokenLabel: 'Token',
        firstNameLabel: 'Primeiro Nome',
        lastNameLabel: 'Último Nome',
        passwordLabel: 'Senha',
        confirmPasswordLabel: 'Repita a senha'
    },

    yupMessages: {
        tokenMatch: 'Apenas dígitos alfanuméricos são válidos',
        tokenInvalid: 'Token inválido!',
        confirmPassword: 'As senhas devem ser iguais'
    },

    links: {
        loginText: 'Login',
        forgotPasswordText: 'Recuperar Conta'
    }

} as BaseTranslation

export default pt_BR_signup