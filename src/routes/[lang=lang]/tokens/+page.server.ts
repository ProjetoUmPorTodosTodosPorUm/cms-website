import type { PageServerLoad } from './$types'
import { listLoad } from '$utils'

export const load: PageServerLoad = async ({ fetch, cookies, url, depends }) => {
	depends('app:list-load')

	return await listLoad('token', fetch, cookies, url)
}
