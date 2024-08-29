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
import { REPORTS_INPUT_LABELS, REPORT_TYPES, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, params }) => {
	return await editLoad('report', fetch, params)
}

export const actions = {
	put: async ({ fetch, request, params }) => {
		const reportTypes = [
			{ value: 'ORDINARY', text: REPORT_TYPES.ordinary },
			{ value: 'SEMESTER', text: REPORT_TYPES.semester },
			{ value: 'ANNUAL', text: REPORT_TYPES.annual }
		]

		const schema = yup.object().shape({
			title: yup.string().required(SHARED.yup.required(REPORTS_INPUT_LABELS.title)),
			text: yup.string().nullable().optional(),
			shortDescription: yup
				.string()
				.required(SHARED.yup.required(REPORTS_INPUT_LABELS.shortDescription)),
			attachments: yup
				.array(yup.string())
				.min(1, SHARED.yup.minNumber(REPORTS_INPUT_LABELS.attachments, 1))
				.required(SHARED.yup.required(REPORTS_INPUT_LABELS.attachments)),
			month: yup
				.number()
				.typeError(SHARED.yup.number(REPORTS_INPUT_LABELS.month))
				.when('type', {
					is: (val: ReportType) => val !== ReportType.ANNUAL && val !== null,
					then: (schema) =>
						schema
							.integer(SHARED.yup.integer(REPORTS_INPUT_LABELS.month))
							.min(1, SHARED.yup.minNumber(REPORTS_INPUT_LABELS.month, 1))
							.max(12, SHARED.yup.maxNumber(REPORTS_INPUT_LABELS.month, 12))
							.required(SHARED.yup.required(REPORTS_INPUT_LABELS.month)),
					otherwise: (schema) => schema.nullable().optional()
				}),
			year: yup
				.number()
				.typeError(SHARED.yup.number(REPORTS_INPUT_LABELS.year))
				.integer(SHARED.yup.integer(REPORTS_INPUT_LABELS.year))
				.min(2000, SHARED.yup.minNumber(REPORTS_INPUT_LABELS.year, 2000))
				.max(2100, SHARED.yup.maxNumber(REPORTS_INPUT_LABELS.year, 2100))
				.required(SHARED.yup.required(REPORTS_INPUT_LABELS.year)),
			type: yup
				.string()
				.oneOf(
					Object.values(ReportType),
					SHARED.yup.oneOf(reportTypes.map((r) => r.text).join(', '))
				)
				.required(SHARED.yup.required(REPORTS_INPUT_LABELS.type)),
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

			const res = await safeFetch(fetch, {
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

	bulkFile: async ({ fetch, request }) => {
		return await bulkFileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
