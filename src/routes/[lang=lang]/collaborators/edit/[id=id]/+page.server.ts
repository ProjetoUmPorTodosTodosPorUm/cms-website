import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	editLoad,
	fileRemoveAction,
	fileAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('collaborator', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, locals, cookies, params }) => {
		const i18n = locals.LL.collaborators.add
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			title: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.titleLabel() })),
			description: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.descriptionLabel() })),
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

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/collaborator/${params.id}`,
				method: 'PUT',
				body: { title, description, image, field }
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

	file: async ({ fetch, request, cookies }) => {
		return await fileAction(fetch, request, cookies)
	},

	fileRemove: async ({ fetch, request, cookies }) => {
		return await fileRemoveAction(fetch, request, cookies)
	}
} satisfies Actions
