import type { PageServerLoad } from './$types'
import { listLoad, restoreAction, hardRemoveAction, removeAction } from '$utils'
import type { Actions } from './$types'

export const load: PageServerLoad = async ({ fetch, cookies, url, depends }) => {
    depends('app:list-load')

    return await listLoad('church', fetch, cookies, url)
}

export const actions = {
    remove: async ({ fetch, request, cookies }) => {
        return await removeAction('church', fetch, request, cookies)
    },

    restore: async ({ fetch, request, cookies }) => {
        return await restoreAction('church', fetch, request, cookies)
    },

    hardRemove: async ({ fetch, request, cookies }) => {
        return await hardRemoveAction('church', fetch, request, cookies)
    }
} satisfies Actions
