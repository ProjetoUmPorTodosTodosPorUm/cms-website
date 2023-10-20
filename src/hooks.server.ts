import { detectLocale, i18n, isLocale } from '$i18n/i18n-util'
import { loadAllLocales } from '$i18n/i18n-util.sync'
import type { Handle, HandleFetch, RequestEvent } from '@sveltejs/kit'
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'
import type { Locales } from './i18n/i18n-types'
import { PUBLIC_API_URL } from '$env/static/public'
import type { UserDto } from './lib/types'

loadAllLocales()
const L = i18n()

export const handle: Handle = async ({ event, resolve }) => {
    // get user from cookie and pass forward
	const user: UserDto = JSON.parse(event.cookies.get('user') || 'null')
	event.locals.user = user

    // read language slug
    const [, lang] = event.url.pathname.split('/')

    // redirect to base locale if no locale slug was found
    if (!lang) {
        const locale = getPreferredLocale(event)

        return new Response(null, {
            status: 302,
            headers: { Location: `/${locale}` },
        })
    }

    // if slug is not a locale, use base locale (e.g. api endpoints)
    const locale = isLocale(lang) ? (lang as Locales) : getPreferredLocale(event)
    const LL = L[locale]

    // bind locale and translation functions to current request
    event.locals.locale = locale
    event.locals.LL = LL

    // Server Headers
	// @ts-ignore
	const APP_SERVER_NAME = __APP_SERVER_NAME__
	event.setHeaders({
		Server: APP_SERVER_NAME
	})

    // replace html lang attribute with correct language
    return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) })
}

const getPreferredLocale = ({ request }: RequestEvent) => {
    // detect the preferred language the user has configured in his browser
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
    const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request)

    return detectLocale(acceptLanguageDetector)
}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.match(PUBLIC_API_URL)) {
		// See package.json script.dev for MODE
		// See API's docker-compose.yml for api's container_name
		//const MODE = import.meta.env.MODE
		let localApiURL = 'http://localhost:3000';

		/*if (MODE == 'preview') {
			localApiURL = 'http://preview-api:3000'
		} else if (MODE == 'production') {
			localApiURL = 'https://api:3000'
		}*/

		// clone the original request, but change the URL
		request = new Request(request.url.replace(PUBLIC_API_URL, localApiURL), request)

		// safe-fetch.ts uses this route to update accessToken and RefreshToken
		if (!request.url.match('/auth/refresh')) {
			const authorizationCookie = event.cookies.get('authorization') || ''
			if (authorizationCookie) {
				request.headers.set('Authorization', authorizationCookie)
			}
		}
	}
	return fetch(request)
}