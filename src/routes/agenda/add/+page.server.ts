import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	bulkFileAction,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { AGENDA_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const schema = yup.object().shape({
			title: yup.string().required(SHARED.yup.required(AGENDA_INPUT_LABELS.title)),
			message: yup.string().required(SHARED.yup.required(AGENDA_INPUT_LABELS.message)),
			attachments: yup.array(yup.string()).nullable().optional(),
			date: yup.string().required(SHARED.yup.required(AGENDA_INPUT_LABELS.date)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const title = data.get('title')
		const message = data.get('message')
		const attachments = data.get('attachments')?.toString()
		const arrAttachments = attachments && attachments?.length > 0 ? attachments?.split(',') : []
		const date = data.get('date')
		const field = data.get('field') ?? undefined

		try {
			schema.validateSync(
				{ title, message, attachments: arrAttachments, date, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/agenda`,
				method: 'POST',
				body: { title, message, attachments: arrAttachments, date, field }
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

	bulkFile: async ({ fetch, request }) => {
		return await bulkFileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
