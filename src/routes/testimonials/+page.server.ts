import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('testimonial', fetch, url)
}

export const actions = {
	remove: async ({ fetch, request }) => {
		return await removeAction('testimonial', fetch, request)
	},

	restore: async ({ fetch, request }) => {
		return await restoreAction('testimonial', fetch, request)
	},

	hardRemove: async ({ fetch, request }) => {
		return await hardRemoveAction('testimonial', fetch, request)
	}
} satisfies Actions
