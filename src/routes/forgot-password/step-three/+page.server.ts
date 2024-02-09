import type { Actions } from './$types'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ApiError } from '$classes/api-error'
import { generateMessages, actionErrorHandler } from '$utils'
import { FORGOT_PASSWORD_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const schema = yup.object().shape({
			password: yup
				.string()
				.min(8, SHARED.yup.minString(FORGOT_PASSWORD_INPUT_LABELS.password, 8))
				.required(SHARED.yup.required(FORGOT_PASSWORD_INPUT_LABELS.password)),
			confirmPassword: yup
				.string()
				.oneOf([yup.ref('password')], FORGOT_PASSWORD_INPUT_LABELS.confirmPassword)
				.required(SHARED.yup.required(FORGOT_PASSWORD_INPUT_LABELS.confirmPassword))
		})

		const data = await request.formData()
		const password = data.get('password')
		const confirmPassword = data.get('confirmPassword')
		const email = data.get('email')
		const token = data.get('token')

		try {
			schema.validateSync({ password, confirmPassword }, { abortEarly: false })

			const res = await fetch(`${PUBLIC_API_URL}/auth/recover-email/confirm`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
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
				email: email,
				messages: generateMessages([{ message: resJson.message, variant: 'success' }])
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
