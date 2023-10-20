import type { Actions } from './$types'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ApiError } from '$classes/api-error'
import { actionErrorHandler } from '$utils'

export const actions = {
	post: async ({ fetch, request, locals, cookies }) => {
		const i18n = locals.LL.login
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			email: yup
				.string()
				.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.emailLabel() })),
			password: yup
				.string()
				.min(8, sharedI18n.yup.min({ field: i18n.inputs.passwordLabel(), length: 8 }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.passwordLabel() }))
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
			let resJson: ApiResponseDto

			if (res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} else {
				resJson = await res.json()
			}

			cookies.set('authorization', `Bearer ${resJson.data.accessToken}`, {
				httpOnly: true,
				secure: false, // change when prod
				path: '/',
				sameSite: true,
				maxAge: 15 * 60 // 15m
			})

			cookies.set('refresh', `Bearer ${resJson.data.refreshToken}`, {
				httpOnly: true,
				secure: false, // change when prod
				path: '/',
				sameSite: true,
				maxAge: 7 * 60 * 60 * 24 // 7d
			})

			cookies.set('user', JSON.stringify(resJson.data.user), {
				httpOnly: true,
				secure: false, // change when prod
				path: '/',
				sameSite: true,
				maxAge: 15 * 60 // 15m
			})

			return {
				apiData: resJson.data.user,
				messages: [
					{
						message: resJson.message,
						id: Date.now(),
						variant: 'success'
					}
				]
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
