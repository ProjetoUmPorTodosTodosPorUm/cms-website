import type { Actions } from './$types'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ApiError } from '$classes/api-error'
import { generateMessages, actionErrorHandler } from '$utils'

export const actions = {
	post: async ({ fetch, request, locals }) => {
		const i18n = locals.LL.signup
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			firstName: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.firstNameLabel() })),
			lastName: yup.string().optional(),
			password: yup
				.string()
				.min(8, sharedI18n.yup.min({ field: i18n.inputs.passwordLabel(), length: 8 }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.passwordLabel() })),
			confirmPassword: yup
				.string()
				.oneOf([yup.ref('password')], i18n.yupMessages.confirmPassword())
				.required(sharedI18n.yup.required({ field: i18n.inputs.confirmPasswordLabel() }))
		})

		const data = await request.formData()
		const firstName = data.get('firstName')
		const lastName = data.get('lastName')
		const password = data.get('password')
		const confirmPassword = data.get('confirmPassword')
		const email = data.get('email')
		const token = data.get('token')

		try {
			schema.validateSync({ firstName, lastName, password, confirmPassword }, { abortEarly: false })

			const res = await fetch(`${PUBLIC_API_URL}/auth/create-email/confirm`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					token,
					password
				})
			})
			let resJson: ApiResponseDto

			if (res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} else {
				resJson = await res.json()
			}

			return {
				finished: true,
				name: firstName,
				messages: generateMessages([{ message: resJson.message, variant: 'success' }])
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
