import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { Role } from '$enums'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'

export const actions = {
	post: async ({ fetch, request, locals, cookies }) => {
		const i18n = locals.LL.users.add
		const sharedI18n = locals.LL.shared
		const roles = [
			{ value: 'VOLUNTEER', text: i18n.roles.volunteer() },
			{ value: 'ADMIN', text: i18n.roles.admin() },
			{ value: 'WEB_MASTER', text: i18n.roles.webMaster() }
		]

		const schema = yup.object().shape({
			name: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.nameLabel() })),
			email: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.emailLabel() })),
			payload: yup.object().shape({
				role: yup
					.string()
					.oneOf(
						Object.values(Role),
						sharedI18n.yup.oneOf({ enums: roles.map((r) => r.text).join(', ') })
					)
					.required(sharedI18n.yup.required({ field: i18n.inputs.roleLabel() }))
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

			const res = await safeFetch(fetch, cookies, {
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
