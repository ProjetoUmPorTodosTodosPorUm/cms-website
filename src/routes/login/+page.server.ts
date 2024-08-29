import type { Actions } from './$types'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto, LoginResponseDto } from '$types'
import { ApiError } from '$classes/api-error'
import { actionErrorHandler, generateMessages } from '$utils'
import { LOGIN_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request, locals }) => {
		const schema = yup.object().shape({
			email: yup
				.string()
				.email(SHARED.yup.email(LOGIN_INPUT_LABELS.email))
				.required(SHARED.yup.required(LOGIN_INPUT_LABELS.email)),
			password: yup
				.string()
				.min(8, SHARED.yup.minString(LOGIN_INPUT_LABELS.password, 8))
				.required(SHARED.yup.required(LOGIN_INPUT_LABELS.password))
		})

		const data = await request.formData()
		const email = data.get('email')
		const password = data.get('password')

		try {
			schema.validateSync({ email, password }, { abortEarly: false })

			const res = await fetch(`${PUBLIC_API_URL}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			})
			

			if (res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} 

			let resJson: ApiResponseDto = await res.json()
			const { user, accessToken, refreshToken } = resJson.data as LoginResponseDto

			const { session } = locals
            await session.setData({
                user,
                accessToken,
                refreshToken
            })
            await session.save()

			return {
				apiData: user,
				messages: generateMessages([{ message: resJson.message, variant: 'success' }])
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
