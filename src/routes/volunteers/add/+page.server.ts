import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import {
	generateMessages,
	safeFetch,
	actionErrorHandler,
	fileAction,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { Occupation } from '$enums'
import { VOLUNTEERS_INPUT_LABELS, VOLUNTEERS_OCCUPATIONS, SHARED } from '$constants'

export const actions = {
	post: async ({ fetch, request }) => {
		const occupations = [
			{ value: 'PRESIDENT', text: VOLUNTEERS_OCCUPATIONS.president },
			{ value: 'VICE_PRESIDENT', text: VOLUNTEERS_OCCUPATIONS.vicePresident },
			{ value: 'GENERAL_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.geralCoordinator },
			{ value: 'COORDINATOR_01', text: VOLUNTEERS_OCCUPATIONS.coordinator01 },
			{ value: 'COUNSELOR_01', text: VOLUNTEERS_OCCUPATIONS.counselor01 },
			{ value: 'COUNSELOR_02', text: VOLUNTEERS_OCCUPATIONS.counselor02 },
			{ value: 'COUNSELOR_03', text: VOLUNTEERS_OCCUPATIONS.counselor03 },
			{ value: 'WEB_MASTER', text: VOLUNTEERS_OCCUPATIONS.webMaster },
			{ value: 'TREASURER_01', text: VOLUNTEERS_OCCUPATIONS.treasurer01 },
			{ value: 'TREASURER_02', text: VOLUNTEERS_OCCUPATIONS.treasurer02 },
			{ value: 'ACADEMIC_INSTRUCTOR_01', text: VOLUNTEERS_OCCUPATIONS.academicInstructor01 },
			{ value: 'ACADEMIC_INSTRUCTOR_02', text: VOLUNTEERS_OCCUPATIONS.academicInstructor02 },
			{ value: 'EXECUTIVE_SECRETARY', text: VOLUNTEERS_OCCUPATIONS.executiveSecretary },
			{ value: 'AUXILIARY_SECRETARY', text: VOLUNTEERS_OCCUPATIONS.auxiliarySecretary },
			{ value: 'COORDINATOR_02', text: VOLUNTEERS_OCCUPATIONS.coordinator02 },
			{ value: 'INFIELD_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.infieldCoordinator },
			{ value: 'OUTFIELD_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.outfieldCoordinator },
			{ value: 'COLLECTOR', text: VOLUNTEERS_OCCUPATIONS.collector },
			{ value: 'SUPPORT_SERVICE', text: VOLUNTEERS_OCCUPATIONS.supportService }
		]

		const schema = yup.object().shape({
			firstName: yup.string().required(SHARED.yup.required(VOLUNTEERS_INPUT_LABELS.firstName)),
			lastName: yup.string().nullable().optional(),
			email: yup
				.string()
				.nullable()
				.email(SHARED.yup.email(VOLUNTEERS_INPUT_LABELS.email))
				.optional(),
			avatar: yup.string().nullable().optional(),
			joinedDate: yup.string().required(SHARED.yup.required(VOLUNTEERS_INPUT_LABELS.joinedDate)),
			occupation: yup
				.string()
				.oneOf(
					Object.values(Occupation),
					SHARED.yup.oneOf(occupations.map((r) => r.text).join(', '))
				)
				.required(SHARED.yup.required(VOLUNTEERS_INPUT_LABELS.occupation)),
			church: yup.string().nullable().optional(),
			priest: yup.string().nullable().optional(),
			observation: yup.string().nullable().optional(),
			field: yup.string().nullable().optional()
		})

		const data = await request.formData()
		const firstName = data.get('firstName')
		const lastName = data.get('lastName')
		const email = data.get('email')
		const avatar = data.get('avatar')
		const joinedDate = data.get('joinedDate')
		const occupation = data.get('occupation')
		const church = data.get('church')
		const priest = data.get('priest')
		const observation = data.get('observation')
		const field = data.get('field')

		try {
			schema.validateSync(
				{
					firstName,
					lastName,
					email,
					avatar: avatar || undefined,
					joinedDate,
					field,
					occupation,
					church,
					priest,
					observation
				},
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/volunteer`,
				method: 'POST',
				body: {
					firstName,
					lastName,
					email: email || undefined,
					avatar,
					joinedDate,
					occupation,
					church,
					priest,
					observation,
					field
				}
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

	file: async ({ fetch, request }) => {
		return await fileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
