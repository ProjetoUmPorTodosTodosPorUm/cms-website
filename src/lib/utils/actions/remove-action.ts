import { PUBLIC_API_URL } from '$env/static/public'
import { fail } from '@sveltejs/kit'
import type { ApiResponseDto } from '$types'
import { generateMessages } from '$utils'
import { safeFetch } from '$utils'

export async function removeAction(
	apiPathname: string,
	skFetch: typeof fetch,
	request: Request,
) {
	const data = await request.formData()
	const id = data.get('id')

	const res = await safeFetch(skFetch, {
		url: `${PUBLIC_API_URL}/${apiPathname}/${id}`,
		method: 'DELETE'
	})
	let resJson: ApiResponseDto

	if (res && res.status !== 200) {
		return fail(res.status, {
			messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }])
		})
	} else {
		resJson = await res?.json()
	}

	return {
		apiData: resJson.data,
		messages: generateMessages([{ message: resJson.message, variant: 'success' }])
	}
}
