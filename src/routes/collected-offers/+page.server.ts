import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('monthly-offer', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('monthly-offer', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('monthly-offer', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('monthly-offer', fetch, request)
	}
} satisfies Actions
