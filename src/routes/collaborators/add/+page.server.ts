import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	fileRemoveAction,
	fileAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { COLLABORATORS_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const schema = yup.object().shape({
			title: yup.string().required(SHARED.yup.required(COLLABORATORS_INPUT_LABELS.title)),
			description: yup
				.string()
				.required(SHARED.yup.required(COLLABORATORS_INPUT_LABELS.description)),
			image: yup.string().nullable().optional(),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const title = data.get('title')
		const description = data.get('description')
		const image = data.get('image')
		const field = data.get('field')

		try {
			schema.validateSync(
				{ title, description, image: image || undefined, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/collaborator`,
				method: 'POST',
				body: { title, description, image, field }
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
	},

	file: async ({ fetch, request }) => {
		return await fileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
