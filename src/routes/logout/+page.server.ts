import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	cookies.delete('authorization', { path: '/' })
	cookies.delete('refresh', { path: '/' })
	cookies.delete('user', { path: '/' })
}
