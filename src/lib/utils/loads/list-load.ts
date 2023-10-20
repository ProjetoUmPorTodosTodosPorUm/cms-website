import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch, fromSearchToPagination, fromPaginationToQuery } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'
import type { Cookies } from '@sveltejs/kit'

// Only Server Side
export async function listLoad(
	apiPathname: RequestInfo,
	skFetch: typeof fetch,
	cookies: Cookies,
	url: URL
) {
	// do not trust user input
	const pagination = fromSearchToPagination(url)
	const queryString = fromPaginationToQuery(pagination)

	const res = await safeFetch(skFetch, cookies, {
		url: `${PUBLIC_API_URL}/${apiPathname}?${queryString}`
	})

	if (res && res.status !== 200) {
		return {
			apiData: [],
			totalCount: 0,
			totalPages: 1,
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }]),
		}
	} else if (res) {
		const resJson = (await res.json()) as ApiResponseDto

		return {
			apiData: resJson.data,
			totalCount: Number(res.headers.get('x-total-count')),
			totalPages: Number(res.headers.get('x-total-pages')),
			messages: generateMessages([{ message: resJson.message, variant: 'success', silent: true }]),
		}
	}

	// fail safe
	return {
		apiData: [],
		totalCount: 0,
		totalPages: 1,
		messages: [],
	}
}




