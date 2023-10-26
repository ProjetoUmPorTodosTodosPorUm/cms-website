import type { BaseTranslation } from '../../i18n-types'

const pt_BR_profile = {
	pageTitle: 'Perfil',

	appHeader: {
		name: 'Perfil',
		buttonText: 'Salvar'
	},

	roles: {
		volunteer: 'Voluntário',
		admin: 'Admin',
		webMaster: 'Web Master'
	},

	inputs: {
		firstNameLabel: 'Primeiro Nome',
		lastNameLabel: 'Último Nome',
		emailLabel: 'E-mail',
		passwordLabel: 'Senha',
		confirmPasswordLabel: 'Repita a Senha',
		roleLabel: 'Acesso'
	},

	yupMessages: {
		confirmPassword: 'As senhas devem ser iguais'
	},

	profilePic: {
		altText: 'Imagem de perfil',
		editText: 'Editar'
	}
} as BaseTranslation

export default pt_BR_profile
