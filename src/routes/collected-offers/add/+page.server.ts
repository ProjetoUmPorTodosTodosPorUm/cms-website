import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'
import { COLLECT_OFFERS_INPUT_LABELS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const schema = yup.object().shape({
			month: yup
				.number()
				.typeError(SHARED.yup.number(COLLECT_OFFERS_INPUT_LABELS.month))
				.integer(SHARED.yup.integer(COLLECT_OFFERS_INPUT_LABELS.month))
				.min(1, SHARED.yup.minNumber(COLLECT_OFFERS_INPUT_LABELS.month, 1))
				.max(12, SHARED.yup.maxNumber(COLLECT_OFFERS_INPUT_LABELS.month, 12))
				.required(SHARED.yup.required(COLLECT_OFFERS_INPUT_LABELS.month)),
			year: yup
				.number()
				.typeError(SHARED.yup.number(COLLECT_OFFERS_INPUT_LABELS.year))
				.integer(SHARED.yup.integer(COLLECT_OFFERS_INPUT_LABELS.year))
				.min(2000, SHARED.yup.minNumber(COLLECT_OFFERS_INPUT_LABELS.year, 2000))
				.max(2100, SHARED.yup.maxNumber(COLLECT_OFFERS_INPUT_LABELS.year, 2100))
				.required(SHARED.yup.required(COLLECT_OFFERS_INPUT_LABELS.year)),
			foodQnt: yup
				.number()
				.typeError(SHARED.yup.number(COLLECT_OFFERS_INPUT_LABELS.foodQnt))
				.integer(SHARED.yup.integer(COLLECT_OFFERS_INPUT_LABELS.foodQnt))
				.required(SHARED.yup.required(COLLECT_OFFERS_INPUT_LABELS.foodQnt)),
			monetaryValue: yup
				.number()
				.typeError(SHARED.yup.number(COLLECT_OFFERS_INPUT_LABELS.monetaryValue))
				.required(SHARED.yup.required(COLLECT_OFFERS_INPUT_LABELS.monetaryValue)),
			othersQnt: yup
				.number()
				.typeError(SHARED.yup.number(COLLECT_OFFERS_INPUT_LABELS.othersQnt))
				.integer(SHARED.yup.integer(COLLECT_OFFERS_INPUT_LABELS.othersQnt))
				.required(SHARED.yup.required(COLLECT_OFFERS_INPUT_LABELS.othersQnt)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const month = data.get('month')
		const year = data.get('year')
		const foodQnt = data.get('foodQnt')
		const monetaryValue = data.get('monetaryValue')
		const othersQnt = data.get('othersQnt')
		const field = data.get('field')

		try {
			schema.validateSync(
				{ month, year, foodQnt, monetaryValue, othersQnt, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/monthly-offer`,
				method: 'POST',
				body: { month, year, foodQnt, monetaryValue, othersQnt, field }
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
