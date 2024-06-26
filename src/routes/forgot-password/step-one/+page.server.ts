import type { Actions } from './$types'
import * as yup from 'yup'
import { actionErrorHandler, generateMessages } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ApiError } from '$classes/api-error'
import { FORGOT_PASSWORD_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request, locals }) => {
		const schema = yup.object().shape({
			email: yup
				.string()
				.email(SHARED.yup.email(FORGOT_PASSWORD_INPUT_LABELS.email))
				.required(SHARED.yup.required(FORGOT_PASSWORD_INPUT_LABELS.email))
		})

		const data = await request.formData()
		const email = data.get('email')

		try {
			schema.validateSync({ email }, { abortEarly: false })

			const res = await fetch(`${PUBLIC_API_URL}/auth/recover-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			})
			let resJson: ApiResponseDto

			if (res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} else {
				resJson = await res.json()
			}

			return {
				step: 'two',
				email,
				messages: generateMessages([{ message: resJson.message, variant: 'success' }])
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
