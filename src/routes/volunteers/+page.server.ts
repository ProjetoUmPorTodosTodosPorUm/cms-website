import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('volunteer', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('volunteer', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('volunteer', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('volunteer', fetch, request)
	}
} satisfies Actions
