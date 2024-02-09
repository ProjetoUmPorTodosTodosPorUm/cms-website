import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'
import { WELCOMED_FAMILIES_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request, cookies }) => {
		const schema = yup.object().shape({
			representative: yup
				.string()
				.required(SHARED.yup.required(WELCOMED_FAMILIES_INPUT_LABELS.representative)),
			observation: yup
				.string()
				.nullable()
				.optional(),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const representative = data.get('representative')
		const observation = data.get('observation') || null
		const field = data.get('field')

		try {
			schema.validateSync({ representative, observation, field }, { abortEarly: false })

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/welcomed-family`,
				method: 'POST',
				body: { representative, observation, field }
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
