import type { PageServerLoad } from './$types'
import { listLoad } from '$utils'

export const load: PageServerLoad = async ({ fetch, url, depends }) => {
	depends('app:list-load')

	return await listLoad('log', fetch, url)
}
