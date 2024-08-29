import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('user', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('user', fetch, request)
	},

	restore: async ({ fetch, request, locals }) => {
		return await restoreAction('user', fetch, request)
	},

	hardRemove: async ({ fetch, request, locals }) => {
		return await hardRemoveAction('user', fetch, request)
	}
} satisfies Actions
