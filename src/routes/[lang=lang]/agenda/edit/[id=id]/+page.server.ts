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

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('agenda', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, locals, cookies, params }) => {
		const i18n = locals.LL.agenda.add
		const sharedI18n = locals.LL.shared

		const schema = yup.object().shape({
			title: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.titleLabel() })),
			message: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.messageLabel() })),
			attachments: yup.array(yup.string()).nullable().optional(),
			date: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.dateLabel() })),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const title = data.get('title')
		const message = data.get('message')
		const attachments = data.get('attachments')?.toString()
		const arrAttachments = attachments && attachments?.length > 0 ? attachments?.split(',') : []
		const date = data.get('date')
		const field = data.get('field')

		try {
			schema.validateSync(
				{ title, message, attachments: arrAttachments, date, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/agenda/${params.id}`,
				method: 'PUT',
				body: { title, message, attachments: arrAttachments, date, field }
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
