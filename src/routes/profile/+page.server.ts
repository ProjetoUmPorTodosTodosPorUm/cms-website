import type { Actions } from '@sveltejs/kit'
import * as yup from 'yup'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import type { PageServerLoad } from './$types'
import {
	generateMessages,
	safeFetch,
	fileAction,
	actionErrorHandler,
	fileRemoveAction
} from '$utils'
import { ApiError } from '$classes/api-error'
import { PROFILE_INPUT_LABELS, SHARED } from '$constants'

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	// code from editLoad
	const res = await safeFetch(fetch, cookies, {
		url: `${PUBLIC_API_URL}/user/me`
	})

	if (res && res.status !== 200) {
		return {
			apiData: {},
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }])
		}
	} else if (res) {
		let resJson = (await res.json()) as ApiResponseDto
		return {
			apiData: resJson.data,
			messages: generateMessages([{ message: resJson.message, variant: 'success', silent: true }])
		}
	}

	// fail safe
	return {
		apiData: {},
		messages: []
	}
}

export const actions = {
	put: async ({ fetch, request, cookies }) => {
		const schema = yup.object().shape(
			{
				firstName: yup.string().required(SHARED.yup.required(PROFILE_INPUT_LABELS.firstName)),
				lastName: yup.string().optional(),
				avatar: yup.string().optional(),
				password: yup.string().when('password', {
					is: (val: string) => val?.length > 0,
					then: (schema) => schema.min(8, SHARED.yup.minString(PROFILE_INPUT_LABELS.password, 8)),
					otherwise: (schema) => schema.nullable().optional()
				}),
				confirmPassword: yup.string().when('password', {
					is: (val: string) => val?.length > 0,
					then: (schema) =>
						schema
							.oneOf([yup.ref('password')], 'As senhas devem ser iguais')
							.required(SHARED.yup.required(PROFILE_INPUT_LABELS.confirmPassword)),
					otherwise: (schema) => schema.nullable().optional()
				})
			},
			[['password', 'password']]
		)

		const data = await request.formData()
		const firstName = data.get('firstName')
		const lastName = data.get('lastName')
		const avatar = data.get('avatar')
		const password = data.get('password')
		const confirmPassword = data.get('confirmPassword')

		try {
			schema.validateSync(
				{
					firstName,
					lastName,
					avatar: avatar || undefined,
					password,
					confirmPassword
				},
				{ abortEarly: false }
			)

			const res = await safeFetch(fetch, cookies, {
				url: `${PUBLIC_API_URL}/user/me`,
				method: 'PUT',
				body: { firstName, lastName, password: password || undefined, avatar }
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
