import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, editLoad } from '$utils'
import { ApiError } from '$classes/api-error'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('welcomed-family', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, locals, cookies, params }) => {
		const i18n = locals.LL['welcomed-families'].add
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			representative: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.representativeLabel() })),
			observation: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.observationLabel() })),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const representative = data.get('representative')
		const observation = data.get('observation')
		const field = data.get('field')

		try {
			schema.validateSync({ representative, observation, field }, { abortEarly: false })

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/welcomed-family/${params.id}`,
				method: 'PUT',
				body: { representative, observation, field }
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
