import type { BaseTranslation } from '../../i18n-types'

const pt_BR_forgot_password = {
	pageTitle: 'Recuperar Conta',

	// by step
	authModal: [
		{
			title: 'Recuperar Conta',
			subTitle: 'Por favor, insira seu e-mail',
			buttonText: 'Próximo'
		},
		{
			title: 'Verificação',
			subTitle: 'Digite o seu token',
			buttonText: 'Validar'
		},
		{
			title: 'Último Passo',
			subTitle: 'Sua nova senha, por favor',
			buttonText: 'Salvar Nova Senha'
		}
	],

	inputs: {
		emailLabel: 'E-mail',
		tokenLabel: 'Token',
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
		signupText: 'Criar Conta'
	}
} as BaseTranslation

export default pt_BR_forgot_password
