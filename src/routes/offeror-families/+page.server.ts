import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('offeror-family', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('offeror-family', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('offeror-family', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('offeror-family', fetch, request)
	}
} satisfies Actions
