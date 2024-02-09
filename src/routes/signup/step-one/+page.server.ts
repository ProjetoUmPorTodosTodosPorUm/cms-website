import type { Actions } from './$types'
import * as yup from 'yup'
import { actionErrorHandler } from '$utils'
import { SIGN_UP_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ request }) => {
		const schema = yup.object().shape({
			email: yup
				.string()
				.email(SHARED.yup.email(SIGN_UP_INPUT_LABELS.email))
				.required(SHARED.yup.required(SIGN_UP_INPUT_LABELS.email))
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
