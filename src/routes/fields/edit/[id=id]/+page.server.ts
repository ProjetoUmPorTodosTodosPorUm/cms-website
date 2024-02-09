import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, actionErrorHandler, editLoad } from '$utils'
import { ApiError } from '$classes/api-error'
import type { PageServerLoad } from './$types'
import { FIELDS_INPUT_LABELS, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('field', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, cookies, params }) => {
		const schema = yup.object().shape({
			continent: yup.string().required(SHARED.yup.required(FIELDS_INPUT_LABELS.continent)),
			country: yup.string().required(SHARED.yup.required(FIELDS_INPUT_LABELS.country)),
			state: yup.string().required(SHARED.yup.required(FIELDS_INPUT_LABELS.state)),
			abbreviation: yup.string().required(SHARED.yup.required(FIELDS_INPUT_LABELS.abbreviation)),
			designation: yup.string().required(SHARED.yup.required(FIELDS_INPUT_LABELS.designation)),
			mapLocation: yup.object().nullable().optional(),
			mapArea: yup.array().nullable().optional(),
			collectionPoints: yup.array().nullable().optional(),
			streetRelation: yup.array(yup.string()).optional()
		})

		const data = await request.formData()
		const continent = data.get('continent')
		const country = data.get('country')
		const state = data.get('state')
		const abbreviation = data.get('abbreviation')
		const designation = data.get('designation')
		const mapLocation = data.get('mapLocation')
		const mapArea = data.get('mapArea')
		const collectionPoints = data.get('collectionPoints')
		const streetRelation = data.get('streetRelation')?.toString()
		const arrStreetRelation =
			streetRelation && streetRelation?.length > 0 ? streetRelation?.split(',') : []

		try {
			schema.validateSync(
				{
					continent,
					country,
					state,
					abbreviation,
					designation,
					mapLocation: mapLocation || undefined,
					mapArea: mapArea || undefined,
					collectionPoints: collectionPoints || undefined,
					streetRelation: arrStreetRelation
				},
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/field/${params.id}`,
				method: 'PUT',
				body: {
					continent,
					country,
					state,
					abbreviation,
					designation,
					mapLocation: mapLocation || undefined,
					mapArea: mapArea || undefined,
					collectionPoints: collectionPoints || undefined,
					streetRelation: arrStreetRelation
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
	}
} satisfies Actions
