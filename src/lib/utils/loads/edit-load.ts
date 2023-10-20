import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'
import type { Cookies } from '@sveltejs/kit'

// Only Server Side
export async function editLoad(
	apiPathname: RequestInfo,
	skFetch: typeof fetch,
	cookies: Cookies,
	params: any
) {
	const res = await safeFetch(skFetch, cookies, {
		url: `${PUBLIC_API_URL}/${apiPathname}/${params.id}`
	})

	if (res && res.status !== 200) {
		return {
			apiData: {},
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }])
		}
	} else if (res) {
		let resJson = (await res.json()) as ApiResponseDto
		return {
			apiData: resJson.data,
			messages: generateMessages([{ message: resJson.message, variant: 'success', silent: true }])
		}
	}

	// fail safe
	return {
		apiData: {},
		messages: []
	}
}
