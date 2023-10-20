import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, url, depends }) => {
	depends('app:list-load')

	return await listLoad('file', fetch, cookies, url)
}

export const actions = {
	remove: async ({ fetch, request, cookies }) => {
		return await removeAction('file', fetch, request, cookies)
	},

	restore: async ({ fetch, request, locals, cookies }) => {
		return await restoreAction('file', fetch, request, cookies)
	},

	hardRemove: async ({ fetch, request, locals, cookies }) => {
		return await hardRemoveAction('file', fetch, request, cookies)
	}
} satisfies Actions
