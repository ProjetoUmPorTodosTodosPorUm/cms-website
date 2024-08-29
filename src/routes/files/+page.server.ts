import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('file', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('file', fetch, request)
	},

	restore: async ({ fetch, request, locals }) => {
		return await restoreAction('file', fetch, request)
	},

	hardRemove: async ({ fetch, request, locals }) => {
		return await hardRemoveAction('file', fetch, request)
	}
} satisfies Actions
