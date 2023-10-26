import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler } from '$utils'
import { ApiError } from '$classes/api-error'
import { OfferorFamilyGroup } from '$enums'

export const actions = {
	post: async ({ fetch, request, locals, cookies }) => {
		const i18n = locals.LL['offeror-families'].add
		const sharedI18n = locals.LL.shared

		const groups = [
			{ value: 'CHURCH', text: i18n.groups.church() },
			{ value: 'COMMUNITY', text: i18n.groups.community() },
			{ value: 'EXTERNAL', text: i18n.groups.external() }
		]

		const schema = yup.object().shape({
			representative: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.representativeLabel() })),
			commitment: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.commitmentLabel() })),
			churchDenomination: yup.string().nullable().optional(),
			group: yup
				.string()
				.oneOf(
					Object.values(OfferorFamilyGroup),
					sharedI18n.yup.oneOf({ enums: groups.map((g) => g.text).join(', ') })
				)
				.required(sharedI18n.yup.required({ field: i18n.inputs.groupLabel() })),
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
				url: `${PUBLIC_API_URL}/offeror-family`,
				method: 'POST',
				body: { representative, commitment, churchDenomination, group, field }
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
