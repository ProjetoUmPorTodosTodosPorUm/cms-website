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

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	return await editLoad('user', fetch, cookies, params)
}

export const actions = {
	put: async ({ fetch, request, cookies, params }) => {
		const roles = [
			{ value: 'VOLUNTEER', text: USERS_ROLES.volunteer },
			{ value: 'ADMIN', text: USERS_ROLES.admin },
			{ value: 'WEB_MASTER', text: USERS_ROLES.webMaster }
		]

		const schema = yup.object().shape({
			name: yup.string().required(SHARED.yup.required(USERS_INPUT_LABELS.name)),
			email: yup.string().required(SHARED.yup.required(USERS_INPUT_LABELS.email)),
			payload: yup.object().shape({
				role: yup
					.string()
					.oneOf(Object.values(Role), SHARED.yup.oneOf(roles.map((r) => r.text).join(', ')))
					.required(SHARED.yup.required(USERS_INPUT_LABELS.role))
			})
		})

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

			const res = await safeFetch(fetch, cookies, {
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

	file: async ({ fetch, request, cookies }) => {
		return await fileAction(fetch, request, cookies)
	},

	fileRemove: async ({ fetch, request, cookies }) => {
		return await fileRemoveAction(fetch, request, cookies)
	}
} satisfies Actions
