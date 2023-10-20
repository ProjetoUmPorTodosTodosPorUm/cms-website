import type { SubmitFunction } from '@sveltejs/kit'

export const editSubmitFunction: SubmitFunction = () => {
	return async ({ update }) => {
		update({ reset: false })
	}
}
