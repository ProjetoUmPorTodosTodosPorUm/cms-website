import { PUBLIC_API_URL } from '$env/static/public'
import { type Cookies, fail } from '@sveltejs/kit'
import type { ApiResponseDto, FileDto } from '$types'
import { generateMessages } from '$utils'
import { safeFetch } from '$utils'

export async function bulkFileAction(skFetch: typeof fetch, request: Request, cookies: Cookies) {
	const data = await request.formData()

	const res = await safeFetch(skFetch, cookies, {
		url: `${PUBLIC_API_URL}/file/bulk`,
		method: 'POST',
		body: data,
		isJson: false
	})
	let resJson: ApiResponseDto

	if (res && res.status !== 201) {
		return fail(res.status, {
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }])
		})
	} else {
		resJson = await res?.json()
	}

	return {
		apiData: { files: resJson.data as FileDto[] },
		messages: generateMessages([{ message: resJson.message, variant: 'success' }])
	}
}
