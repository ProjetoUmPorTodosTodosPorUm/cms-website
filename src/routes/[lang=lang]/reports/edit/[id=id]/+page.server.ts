import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	editLoad,
	bulkFileAction,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { ReportType } from '$enums'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('report', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, locals, cookies, params }) => {
		const i18n = locals.LL.reports.add
		const sharedI18n = locals.LL.shared

		const reportTypes = [
			{ value: 'ORDINARY', text: i18n.reportTypes.ordinary() },
			{ value: 'SEMESTER', text: i18n.reportTypes.semester() },
			{ value: 'ANNUAL', text: i18n.reportTypes.annual() }
		]

		const schema = yup.object().shape({
			title: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.titleLabel() })),
			text: yup.string().nullable().optional(),
			shortDescription: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.shortDescriptionLabel() })),
			attachments: yup
				.array(yup.string())
				.min(1, sharedI18n.yup.minNumber({ field: i18n.inputs.attachmentsLabel(), value: 1 }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.attachmentsLabel() })),
			month: yup
				.number()
				.typeError(sharedI18n.yup.number({ field: i18n.inputs.monthLabel() }))
				.when('type', {
					is: (val: ReportType) => val !== ReportType.ANNUAL && val !== null,
					then: (schema) =>
						schema
							.integer(sharedI18n.yup.integer({ field: i18n.inputs.monthLabel() }))
							.min(1, sharedI18n.yup.minNumber({ field: i18n.inputs.monthLabel(), value: 1 }))
							.max(12, sharedI18n.yup.maxNumber({ field: i18n.inputs.monthLabel(), value: 1 }))
							.required(sharedI18n.yup.required({ field: i18n.inputs.monthLabel() })),
					otherwise: (schema) => schema.nullable().optional()
				}),
			year: yup
				.number()
				.typeError(sharedI18n.yup.number({ field: i18n.inputs.yearLabel() }))
				.integer(sharedI18n.yup.integer({ field: i18n.inputs.yearLabel() }))
				.min(2000, sharedI18n.yup.minNumber({ field: i18n.inputs.yearLabel(), value: 2000 }))
				.max(2100, sharedI18n.yup.maxNumber({ field: i18n.inputs.yearLabel(), value: 2100 }))
				.required(sharedI18n.yup.required({ field: i18n.inputs.yearLabel() })),
			type: yup
				.string()
				.oneOf(
					Object.values(ReportType),
					sharedI18n.yup.oneOf({ enums: reportTypes.map((r) => r.text).join(', ') })
				)
				.required(sharedI18n.yup.required({ field: i18n.inputs.typeLabel() })),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const title = data.get('title')
		const text = data.get('text')
		const shortDescription = data.get('shortDescription')
		const attachments = data.get('attachments')?.toString()
		const arrAttachments = attachments && attachments?.length > 0 ? attachments?.split(',') : []
		const month = data.get('month')
		const year = data.get('year')
		const type = data.get('type')
		const field = data.get('field')

		// type === ReportType.ANNUAL ? null : month

		try {
			schema.validateSync(
				{ title, text, shortDescription, attachments: arrAttachments, month, year, type, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/report/${params.id}`,
				method: 'PUT',
				body: {
					title,
					text,
					shortDescription,
					attachments: arrAttachments,
					month,
					year,
					type,
					field
				}
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
