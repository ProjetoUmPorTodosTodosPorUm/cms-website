import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { Role } from '$enums'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'
import { USERS_INPUT_LABELS, USERS_ROLES, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const roles = [
			{ value: 'VOLUNTEER', text: USERS_ROLES.volunteer },
			{ value: 'ADMIN', text: USERS_ROLES.admin },
			{ value: 'WEB_MASTER', text: USERS_ROLES.webMaster }
		]

		const schema = yup.object().shape({
			name: yup.string().required(SHARED.yup.required(USERS_INPUT_LABELS.name)),
			email: yup.string().required(SHARED.yup.required(USERS_INPUT_LABELS.email)),
			payload: yup.object().shape({
				role: yup
					.string()
					.oneOf(Object.values(Role), SHARED.yup.oneOf(roles.map((r) => r.text).join(', ')))
					.required(SHARED.yup.required(USERS_INPUT_LABELS.role))
			})
		})

		const data = await request.formData()
		const name = data.get('name')
		const email = data.get('email')
		const role = data.get('role')
		const field = data.get('field')?.toString()
		const payload = { role, field: field || undefined }

		try {
			schema.validateSync({ name, email, payload }, { abortEarly: false })

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/auth/create-email`,
				method: 'POST',
				body: { name, email, payload }
			})
			let resJson: ApiResponseDto

			if (res && res.status !== 201) {
				throw new ApiError((await res.json()) as ApiResponseDto, res.status)
			} else {
				resJson = await res?.json()
			}

			return {
				apiData: resJson.data,
				messages: generateMessages([{ message: resJson.message, variant: 'success' }])
			}
		} catch (error) {
			return actionErrorHandler(error)
		}
	}
} satisfies Actions
