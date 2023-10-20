import type { Cookies } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { Locales } from '$i18n/i18n-types'
import type { UserDto } from '$types'
import { Role } from '$enums'
import { fieldsLoad } from '$utils'

const publicRouteIds = [
	'/[lang=lang]/login',
	'/[lang=lang]/signup/step-one',
	'/[lang=lang]/signup/step-two',
	'/[lang=lang]/signup/step-three',
	'/[lang=lang]/signup/finished',
	'/[lang=lang]/forgot-password/step-one',
	'/[lang=lang]/forgot-password/step-two',
	'/[lang=lang]/forgot-password/step-three',
	'/[lang=lang]/forgot-password/finished'
]
const adminRouteIds = /(\/files.*|\/logs.*|\/users.*)/

export const load: LayoutServerLoad = async ({ locals: { locale, user, LL }, cookies, route, depends }) => {
	depends('app:fields-load')

	// guard routes
	AuthGuard(cookies, route.id ?? '', locale)

	// pass locale information from "server-context" to "shared server + client context"
	const isWebMaster = user?.role === "WEB_MASTER"
	if (isWebMaster) {
		return {
			...await fieldsLoad(fetch, cookies),
			locale,
			user,
		}
	} else {
		return {
			fields: [],
			locale,
			user,
		}
	}
}

function AuthGuard(cookies: Cookies, routeId: string, locale: Locales) {
	const authCookie = cookies.get('authorization')
	const refreshCookie = cookies.get('refresh')
	const userCookie: UserDto = JSON.parse(cookies.get('user') || '{}')

	if (!isPublicRoute(routeId)) {
		if (!authCookie || !refreshCookie || !userCookie) {
			// TODO error page not logged in
			// button to log in
			throw redirect(307, `/${locale}/login`)
		} else if (adminRouteIds.test(routeId) && userCookie.role !== Role.WEB_MASTER) {
			// TODO error page not admin
			// button to dashboard
			throw redirect(307, `/${locale}/`)
		}
	}
}

function isPublicRoute(routeId: string) {
	return publicRouteIds.includes(routeId)
}
