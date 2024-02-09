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
			token: yup
				.string()
				.matches(/^[A-Z0-9]{6}$/, 'Apenas dígitos alfanuméricos são válidos')
				.required(SHARED.yup.required(FORGOT_PASSWORD_INPUT_LABELS.token))
		})

		const data = await request.formData()
		const email = data.get('email')
		const token: string[] = data.getAll('token') as any
		try {
			schema.validateSync({ token: token.join('') }, { abortEarly: false })

			const res = await fetch(`${PUBLIC_API_URL}/auth/token-validate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, token: token.join('') })
			})
			let resJson: ApiResponseDto

			if (res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} else {
				resJson = await res.json()
			}

			const isTokenValid = resJson.data
			if (isTokenValid) {
				return {
					step: 'three',
					email,
					token: token.join(''),
					messages: generateMessages([{ message: resJson.message, variant: 'success' }])
				}
			} else {
				return {
					messages: generateMessages([{ message: 'Token inválido!', variant: 'danger' }])
				}
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
