import { error, type Cookies } from '@sveltejs/kit'
import { PUBLIC_API_URL } from '$env/static/public'
import type { ApiResponseDto } from '$types'
import { delay } from './delay'

type safeFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type safeFetchOptions = {
	url: RequestInfo
	method?: safeFetchMethod
	headers?: HeadersInit
	body?: any
	isJson?: boolean
}

// Only Server Side
export async function safeFetch(
	skFetch: typeof fetch,
	cookies: Cookies,
	options: safeFetchOptions
) {
	// Seting defaults if empty
	options.method = options.method ?? 'GET'
	options.isJson = options.isJson ?? true

	const fetchOptions: Omit<safeFetchOptions, 'url'> = {
		method: options.method,
		headers: {
			Accept: 'application/json',
			...options.headers
		}
	}

	if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
		if (options.body) {
			if (options.isJson) {
				fetchOptions.headers = {
					...fetchOptions.headers,
					'Content-Type': 'application/json'
				}
				fetchOptions.body = JSON.stringify(options.body)
			} else {
				fetchOptions.headers = {
					...fetchOptions.headers
				}
				fetchOptions.body = options.body
			}
		}
	}

	let attempt = 1
	const maxAttempt = 3
	let res: Response | undefined
	while (attempt <= maxAttempt) {
		res = await skFetch(options.url, fetchOptions)

		// probably expired token
		if (res.status == 401 || res.status == 429) {
			const refreshCookie = cookies.get('refresh')
			if (refreshCookie) {
				await revalidateToken(skFetch, cookies)
			} else {
				cookies.delete('authorization', { path: '/' })
				cookies.delete('refresh', { path: '/' })
				cookies.delete('user', { path: '/' })
				throw error(401, { status: 401, message: 'NOT AUTHORIZED safe-fetch.ts' })
			}
		} else {
			return res
		}

		if (res.status !== 429) {
			attempt++
		}
		await delay(100)
	}
	return res
}

const revalidateToken = async (skFetch: typeof fetch, cookies: Cookies) => {
	const res = await skFetch(`${PUBLIC_API_URL}/auth/refresh`, {
		method: 'POST',
		headers: {
			Authorization: cookies.get('refresh') ?? '',
			'Content-Type': 'application/json'
		}
	})

	if (res.status !== 201 && res.status !== 429 && res.status < 500) {
		// refresh token invalid/too old
		cookies.delete('authorization', { path: '/' })
		cookies.delete('refresh', { path: '/' })
		cookies.delete('user', { path: '/' })
	} else if (res.status === 201) {
		let resJson: ApiResponseDto = await res.json()

		cookies.set('authorization', `Bearer ${resJson.data.accessToken}`, {
			httpOnly: true,
			secure: false, // change when prod
			path: '/',
			sameSite: true,
			maxAge: 15 * 60 // 15m
		})

		cookies.set('refresh', `Bearer ${resJson.data.refreshToken}`, {
			httpOnly: true,
			secure: false, // change when prod
			path: '/',
			sameSite: true,
			maxAge: 7 * 60 * 60 * 24 // 7d
		})
	}
}
