import { ApiError } from '$classes/api-error'
import { generateMessages } from '$utils'
import { fail } from '@sveltejs/kit'
import * as yup from 'yup'

export function actionErrorHandler(error: unknown) {
	if (error instanceof ApiError) {
		if (error.status === 400) {
			if (Array.isArray(error.data)) {
				return fail(error.status, {
					messages: generateMessages(error.data.map((err: string) => ({ message: err })))
				})
			} else {
				// @TODO maybe merge with else?
				return fail(error.status, { messages: generateMessages([{ message: error.message }]) })
			}
		} else {
			return fail(error.status, { messages: generateMessages([{ message: error.message }]) })
		}
	} else if (error instanceof yup.ValidationError) {
		return fail(400, {
			messages: generateMessages(error.inner.map((err) => ({ message: err.message })))
		})
	} else {
		throw error
	}
}
