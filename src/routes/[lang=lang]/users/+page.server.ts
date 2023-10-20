import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, url, depends }) => {
	depends('app:list-load')

	return await listLoad('user', fetch, cookies, url)
}

export const actions = {
	remove: async ({ fetch, request, cookies }) => {
		return await removeAction('user', fetch, request, cookies)
	},

	restore: async ({ fetch, request, locals, cookies }) => {
		return await restoreAction('user', fetch, request, cookies)
	},

	hardRemove: async ({ fetch, request, locals, cookies }) => {
		return await hardRemoveAction('user', fetch, request, cookies)
	}
} satisfies Actions
