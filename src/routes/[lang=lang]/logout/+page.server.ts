import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals, cookies }) => {
	cookies.delete('authorization', { path: '/' })
	cookies.delete('refresh', { path: '/' })
	cookies.delete('user', { path: '/' })
}
