export const SHARED = {
	yup: {
		required: (field: string) => `${field} é um campo obrigatório.'`,
		oneOf: (field: string) => `Você deve escoher um dentre os valores: ${field}`,
		minString: (field: string, length: number) =>
			`${field} deve ter no mínimo ${length} caracteres.`,
		maxString: (field: string, length: number) =>
			`${field} deve ter no máximo ${length} caracteres.`,
		minNumber: (field: string, value: number) => `${field} deve ser no mínimo ${value}.`,
		maxNumber: (field: string, value: number) => `${field} deve ser no máximo ${value}.`,
		number: (field: string) => `${field} deve ser um número válido.`,
		integer: (field: string) => `${field} deve ser um número inteiro.`,
		email: (field: string) => `${field} deve ser um e-mail válido.`
	},

	collectionHeader: {
		createdAtLabel: 'Criado Em',
		updatedAtLabel: 'Atualizado Em',
		deletedLabel: 'Deletado Em'
	},

	remove: {
		users: (data: any) => `Você deseja remover a conta de ${data.email}?`,
		files: (data: any) => `Você deseja remover o arquivo ${data.name}?`,
		logs: (data: any) => `Você deseja remover o log de ${data.createdAt}?`,
		agenda: (data: any) => `Você deseja remover o evento ${data.title}?`,
		announcements: (data: any) => `Você deseja remover o aviso ${data.title}?`,
		testimonials: (data: any) => `Você deseja remover o testemunho de ${data.name}?`,
		reports: (data: any) => `Você deseja remover o relatório ${data.title}?`,
		'offeror-families': (data: any) =>
			`Você deseja remover a família ofertante representada pelo(a) ${data.representative}?`,
		'welcomed-families': (data: any) =>
			`Você deseja remover a família acolhida representada pelo(a) ${data.representative}?`,
		fields: (data: any) => `Você deseja remover o campo missionário ${data.designation}?`,
		churches: (data: any) => `Você deseja remover a igreja ${data.name}?`,
		collaborators: (data: any) => `Você deseja remover o colaborador ${data.title}?`,
		'recovery-houses': (data: any) => `Você deseja remover a casa de recuperação ${data.title}?`,
		'collected-offers': (data: any) =>
			`Você deseja remover a oferta coletada de ${data.month}/${data.year}?`,
		volunteers: (data: any) => `Você deseja remover o voluntário(a) ${data.firstName}?`,
		contacts: (data: any) => `Você deseja remover a mensagem enviada por ${data.email}?`,
	},

	isStatus: {
		true: 'Sim',
		false: 'Não'
	}
}
