import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, editLoad } from '$utils'
import { ApiError } from '$classes/api-error'
import { OfferorFamilyGroup } from '$enums'
import type { PageServerLoad } from './$types'
import { OFFEROR_FAMILIES_INPUT_LABELS, OFFEROR_FAMILIES_GROUPS, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('offeror-family', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, cookies, params }) => {
		const groups = [
			{ value: 'CHURCH', text: OFFEROR_FAMILIES_GROUPS.church },
			{ value: 'COMMUNITY', text: OFFEROR_FAMILIES_GROUPS.community },
			{ value: 'EXTERNAL', text: OFFEROR_FAMILIES_GROUPS.external }
		]

		const schema = yup.object().shape({
			representative: yup
				.string()
				.required(SHARED.yup.required(OFFEROR_FAMILIES_INPUT_LABELS.representative)),
			commitment: yup
				.string()
				.required(SHARED.yup.required(OFFEROR_FAMILIES_INPUT_LABELS.commitment)),
			churchDenomination: yup.string().nullable().optional(),
			group: yup
				.string()
				.oneOf(
					Object.values(OfferorFamilyGroup),
					SHARED.yup.oneOf(groups.map((g) => g.text).join(', '))
				)
				.required(SHARED.yup.required(OFFEROR_FAMILIES_INPUT_LABELS.group)),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const representative = data.get('representative')
		const commitment = data.get('commitment')
		const churchDenomination = data.get('churchDenomination')
		const group = data.get('group')
		const field = data.get('field')

		try {
			schema.validateSync(
				{ representative, commitment, churchDenomination, group, field },
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/offeror-family/${params.id}`,
				method: 'PUT',
				body: { representative, commitment, churchDenomination, group, field }
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
