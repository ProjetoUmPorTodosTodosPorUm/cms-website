import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { ChurchType } from '$enums'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	bulkFileAction,
	editLoad,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import type { PageServerLoad } from './$types'
import { CHURCHES_INPUT_LABELS, CHURCH_TYPES, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('church', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, cookies, params }) => {
		const churchTypes = [
			{ value: 'PIONEER', text: CHURCH_TYPES.pioneer },
			{ value: 'EXPANSION', text: CHURCH_TYPES.expansion },
			{ value: 'SUPPORT', text: CHURCH_TYPES.support },
			{ value: 'RESPONSIBLE', text: CHURCH_TYPES.responsible }
		]

		const schema = yup.object().shape({
			name: yup.string().required(SHARED.yup.required(CHURCHES_INPUT_LABELS.name)),
			description: yup.string().required(SHARED.yup.required(CHURCHES_INPUT_LABELS.description)),
			images: yup.array(yup.string()).nullable().optional(),
			type: yup
				.string()
				.oneOf(
					Object.values(ChurchType),
					SHARED.yup.oneOf(churchTypes.map((r) => r.text).join(', '))
				)
				.required(SHARED.yup.required(CHURCHES_INPUT_LABELS.type)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const name = data.get('name')
		const description = data.get('description')
		const images = data.get('images')?.toString()
		const arrImages = images && images?.length > 0 ? images?.split(',') : []
		const type = data.get('type')
		const field = data.get('field')

		try {
			schema.validateSync(
				{ name, description, images: arrImages, type, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/church/${params.id}`,
				method: 'PUT',
				body: { name, description, images: arrImages, type, field }
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
	},

	bulkFile: async ({ fetch, request, cookies }) => {
		return await bulkFileAction(fetch, request, cookies)
	},

	fileRemove: async ({ fetch, request, cookies }) => {
		return await fileRemoveAction(fetch, request, cookies)
	}
} satisfies Actions
