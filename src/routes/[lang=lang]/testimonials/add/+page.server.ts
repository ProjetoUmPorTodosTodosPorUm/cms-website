import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'

export const actions = {
	post: async ({ fetch, request, locals, cookies }) => {
		const i18n = locals.LL.testimonials.add
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			name: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.nameLabel() })),
			email: yup
				.string()
				.nullable()
				.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
				.optional(),
			text: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.textLabel() })),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const name = data.get('name')
		const email = data.get('email')
		const text = data.get('text')
		const field = data.get('field')

		try {
			schema.validateSync({ name, email, text, field }, { abortEarly: false })

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/testimonial`,
				method: 'POST',
				body: { name, email: email || undefined, text, field }
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
