import { redirect } from '@sveltejs/kit'
import type { LayoutRouteId, LayoutServerLoad } from './$types'
import { Role } from '$enums'
import { fieldsLoad } from '$utils'
import type { Session } from 'svelte-kit-sessions'

const publicRouteIdsRegExp = /(\/sigup.*|\/forgot-password.*|\/health|\/login)/
const adminRouteIdsRegExp = /(\/files.*|\/logs.*|\/tokens.*|\/users.*)/

export const load: LayoutServerLoad = async ({ locals, route, depends, fetch }) => {
	depends('app:fields-load')

	const { session } = locals
	AuthGuard(session, route.id)

	// pass information from "server-context" to "shared server + client context"
	const isWebMaster = session.data && session.data.user?.role === Role.WEB_MASTER
	if (isWebMaster) {
		return {
			...(await fieldsLoad(fetch)),
			user: session.data.user
		}
	} else if(session.data) {
		return {
			fields: [],
			user: session.data.user
		}
	} else {
		return {
			fields: [],
			user: null
		}
	}
}

function AuthGuard(session: Session, routeId: LayoutRouteId) {
	if (!isPublicRoute(routeId)) {
        if (!session.data.user || !session.data.accessToken) {
            redirect(307, '/login')
        }

		// full access
		if(session.data.user?.role === Role.WEB_MASTER) {
			return
		}

        if (isAdminRoute(routeId) && session.data.user?.role !== Role.ADMIN) {
            redirect(307, '/')
        }
    } else if (routeId?.toString() == '/login') {
        if (session.data.user && session.data.accessToken) {
            redirect(307, '/')
        }
    }
}

function isPublicRoute(routeId: LayoutRouteId) {
	return publicRouteIdsRegExp.test(String(routeId))
}

function isAdminRoute(routeId: LayoutRouteId) {
	return adminRouteIdsRegExp.test(String(routeId))
}
