import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
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
import { ANNOUNCEMENTS_INPUT_LABEL, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, params }) => {
	return await editLoad('announcement', fetch, params)
}

export const actions = {
	put: async ({ fetch, request, params }) => {
		const schema = yup.object().shape({
			title: yup.string().required(SHARED.yup.required(ANNOUNCEMENTS_INPUT_LABEL.title)),
			message: yup.string().required(SHARED.yup.required(ANNOUNCEMENTS_INPUT_LABEL.message)),
			attachments: yup.array(yup.string()).nullable().optional(),
			fixed: yup.boolean().required(SHARED.yup.required(ANNOUNCEMENTS_INPUT_LABEL.fixed)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const title = data.get('title')
		const message = data.get('message')
		const attachments = data.get('attachments')?.toString()
		const arrAttachments = attachments && attachments?.length > 0 ? attachments?.split(',') : []
		const fixed = data.get('fixed')?.toString() === 'true'
		const field = data.get('field')

		try {
			schema.validateSync(
				{ title, message, attachments: arrAttachments, fixed, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/announcement/${params.id}`,
				method: 'PUT',
				body: { title, message, attachments: arrAttachments, fixed, field }
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

	bulkFile: async ({ fetch, request }) => {
		return await bulkFileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
