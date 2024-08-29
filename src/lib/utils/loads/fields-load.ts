import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'

export async function fieldsLoad(skFetch: typeof fetch) {
	const res = await safeFetch(skFetch, {
		url: `${PUBLIC_API_URL}/field?itemsPerPage=100`
	})

	if (res && res.status !== 200) {
		return {
			fields: [],
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }])
		}
	} else if (res) {
		const resJson = (await res.json()) as ApiResponseDto

		return {
			fields: resJson.data
		}
	}

	// fail safe
	return {
		fields: []
	}
}
