import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { Role } from '$enums'
import type { PageServerLoad } from './$types'
import {
	generateMessages,
	safeFetch,
	editLoad,
	fileAction,
	actionErrorHandler,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { USERS_INPUT_LABELS, USERS_ROLES, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, params }) => {
	return await editLoad('user', fetch, params)
}

export const actions = {
	put: async ({ fetch, request, params }) => {
		const roles = [
			{ value: 'VOLUNTEER', text: USERS_ROLES.volunteer },
			{ value: 'ADMIN', text: USERS_ROLES.admin },
			{ value: 'WEB_MASTER', text: USERS_ROLES.webMaster }
		]

		const schema = yup.object().shape(
			{
				firstName: yup.string().required(SHARED.yup.required(USERS_INPUT_LABELS.firstName)),
				lastName: yup.string().optional(),
				avatar: yup.string().optional(),
				role: yup
					.string()
					.oneOf(Object.values(Role), SHARED.yup.oneOf(roles.map((r) => r.text).join(', ')))
					.required(SHARED.yup.required(USERS_INPUT_LABELS.role))
			},
		)

		const data = await request.formData()
		const firstName = data.get('firstName')
		const lastName = data.get('lastName')
		const role = data.get('role')
		const avatar = data.get('avatar')

		try {
			schema.validateSync(
				{
					firstName,
					lastName,
					role,
					avatar: avatar || undefined
				},
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, {
				url: `${PUBLIC_API_URL}/user/${params.id}`,
				method: 'PUT',
				body: { firstName, lastName, role, avatar }
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

	file: async ({ fetch, request }) => {
		return await fileAction(fetch, request)
	},

	fileRemove: async ({ fetch, request }) => {
		return await fileRemoveAction(fetch, request)
	}
} satisfies Actions
