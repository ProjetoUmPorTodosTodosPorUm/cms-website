import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, editLoad } from '$utils'
import { ApiError } from '$classes/api-error'
import type { PageServerLoad } from './$types'
import { TESTIMONIALS_INPUT_LABELS, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, params }) => {
	return await editLoad('testimonial', fetch, params)
}

export const actions = {
	put: async ({ fetch, request, params }) => {
		const schema = yup.object().shape({
			name: yup.string().required(SHARED.yup.required(TESTIMONIALS_INPUT_LABELS.name)),
			email: yup
				.string()
				.nullable()
				.email(SHARED.yup.email(TESTIMONIALS_INPUT_LABELS.email))
				.optional(),
			text: yup.string().required(SHARED.yup.required(TESTIMONIALS_INPUT_LABELS.text)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const name = data.get('name')
		const email = data.get('email')
		const text = data.get('text')
		const field = data.get('field')

		try {
			schema.validateSync({ name, email, text, field }, { abortEarly: false })

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/testimonial/${params.id}`,
				method: 'PUT',
				body: { name, email: email || undefined, text, field }
			})
			let resJson: ApiResponseDto

			if (res && res.status !== 200) {
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
