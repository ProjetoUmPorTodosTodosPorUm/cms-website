import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('report', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('report', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('report', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('report', fetch, request)
	}
} satisfies Actions
