import type { Cookies } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { UserDto } from '$types'
import { Role } from '$enums'
import { fieldsLoad } from '$utils'

const publicRouteIds = [
	'/login',
	'/signup/step-one',
	'/signup/step-two',
	'/signup/step-three',
	'/signup/finished',
	'/forgot-password/step-one',
	'/forgot-password/step-two',
	'/forgot-password/step-three',
	'/forgot-password/finished',
	'/health'
]
const adminRouteIds = /(\/files.*|\/logs.*|\/users.*)/

export const load: LayoutServerLoad = async ({
	locals: { user },
	cookies,
	route,
	depends,
	fetch
}) => {
	depends('app:fields-load')

	// guard routes
	AuthGuard(cookies, route.id ?? '')

	// pass information from "server-context" to "shared server + client context"
	const isWebMaster = user?.role === 'WEB_MASTER'
	if (isWebMaster) {
		return {
			...(await fieldsLoad(fetch, cookies)),
			user
		}
	} else {
		return {
			fields: [],
			user
		}
	}
}

function AuthGuard(cookies: Cookies, routeId: string) {
	const authCookie = cookies.get('authorization')
	const refreshCookie = cookies.get('refresh')
	const userCookie: UserDto = JSON.parse(cookies.get('user') || '{}')

	if (!isPublicRoute(routeId)) {
		if (!authCookie || !refreshCookie || !userCookie) {
			// TODO error page not logged in
			// button to log in
			redirect(307, `/login`);
		} else if (adminRouteIds.test(routeId) && userCookie.role !== Role.WEB_MASTER) {
			// TODO error page not admin
			// button to dashboard
			redirect(307, `/`);
		}
	}
}

function isPublicRoute(routeId: string) {
	return publicRouteIds.includes(routeId)
}
