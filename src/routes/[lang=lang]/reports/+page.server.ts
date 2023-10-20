import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, url, depends }) => {
    depends('app:list-load')

    return await listLoad('report', fetch, cookies, url)
}

export const actions = {
    remove: async ({ fetch, request, cookies }) => {
        return await removeAction('report', fetch, request, cookies)
    },

    restore: async ({ fetch, request, cookies }) => {
        return await restoreAction('report', fetch, request, cookies)
    },

    hardRemove: async ({ fetch, request, cookies }) => {
        return await hardRemoveAction('report', fetch, request, cookies)
    }
} satisfies Actions
