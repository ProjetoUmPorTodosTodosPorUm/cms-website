import type { Actions } from './$types'
import * as yup from 'yup'
import { actionErrorHandler } from '$utils'

export const actions = {
	post: async ({ request, locals }) => {
		const i18n = locals.LL.signup
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			email: yup
				.string()
				.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.emailLabel() }))
		})

		const data = await request.formData()
		const email = data.get('email')

		try {
			schema.validateSync({ email }, { abortEarly: false })

			return {
				step: 'two',
				email,
				messages: []
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
