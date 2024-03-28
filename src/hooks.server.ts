import type { Handle, HandleFetch } from '@sveltejs/kit'
import { PUBLIC_API_URL } from '$env/static/public'
import type { UserDto } from './lib/types'

export const handle: Handle = async ({ event, resolve }) => {
	// get user from cookie and pass forward
	const user: UserDto = JSON.parse(event.cookies.get('user') || 'null')
	event.locals.user = user

	return resolve(event)
}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.match(PUBLIC_API_URL)) {
		// See package.json script.dev for MODE
		// See API's docker-compose.yml for api's container_name
		const MODE = process.env.NODE_ENV
		let localApiURL = 'http://localhost:3000'

		if (MODE == 'preview') {
			localApiURL = 'http://preview-api:3000'
		} else if (MODE == 'production') {
			localApiURL = 'http://api:3000'
		}

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
