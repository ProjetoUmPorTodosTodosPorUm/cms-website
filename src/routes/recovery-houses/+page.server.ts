import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('recovery-house', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('recovery-house', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('recovery-house', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('recovery-house', fetch, request)
	}
} satisfies Actions
