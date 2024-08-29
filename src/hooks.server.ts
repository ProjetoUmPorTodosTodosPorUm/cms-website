import type { HandleFetch } from '@sveltejs/kit'
import { sveltekitSessionHandle } from 'svelte-kit-sessions';
import RedisStore from 'svelte-kit-connect-redis';
import { Redis } from 'ioredis';
import { safeFetch } from '$utils'
import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public'
import { env } from '$env/dynamic/private';

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

		// Set Authorization Header
		if (event.locals.session.data.accessToken) {
			request.headers.set('Authorization', `Bearer ${event.locals.session.data.accessToken}`)
		}

		return new Promise(async (resolve, reject) => {
			try {
				let res = await fetch(request)

				// Retries if status 401 is met
				if (!res.ok && res.status === 401 && !request.url.match(/\/auth\/sign/)) {
					if (!event.locals.session.data.refreshToken) {
						redirect(307, '/logout')
					}

					// get new tokens
					if (event.locals.session.data.refreshToken) {
						const tokenRes = await safeFetch(fetch, {
							url: `${localApiURL}/auth/refresh`,
							method: 'POST',
							headers: {
								'Authorization': `Bearer ${event.locals.session.data.refreshToken}`
							}
						})

						if (!tokenRes.ok || tokenRes.status !== 201) {
							redirect(307, '/logout')
						}

						/** @type {import('$types/responses').RefreshResponse} */
						const tokens = (await tokenRes.json()).data
						await event.locals.session.setData({
							...tokens,
							user: event.locals.session.data.user
						})
						await event.locals.session.save()

						// retry request
						request.headers.set('Authorization', `Bearer ${event.locals.session.data.accessToken}`)
						res = await fetch(request)
					}
				}

				resolve(res)
			} catch (err) {
				console.log('err', err)
				reject(err)
			}
		})
	}

	// fallback
	return fetch(request)
}

// if more hooks needed
// https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence
const client = new Redis({
	host: env.REDIS_HOST,
	port: Number(env.REDIS_PORT)
});

export const handle = sveltekitSessionHandle({
	secret: env.SESSION_SECRET ?? '',
	// @ts-ignore
	store: new RedisStore({ client }), // other compatible stores are available
	cookie: {
		secure: process.env.NODE_ENV === 'production' ? true : false,
		httpOnly: process.env.NODE_ENV === 'production' ? true : false,
		sameSite: 'strict',
		// 7 days in ms
		expires: new Date((new Date()).valueOf() + (7 * 24 * 60 * 60 * 1000))
	}
});
