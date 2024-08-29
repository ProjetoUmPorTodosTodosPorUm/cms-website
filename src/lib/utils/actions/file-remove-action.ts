import { PUBLIC_API_URL } from '$env/static/public'
import { fail } from '@sveltejs/kit'
import type { ApiResponseDto, FileDto, Pagination } from '$types'
import { fromPaginationToQuery, generateMessages } from '$utils'
import { safeFetch } from '$utils'

export async function fileRemoveAction(skFetch: typeof fetch, request: Request) {
	const data = await request.formData()
	const fileName = data.get('filename')?.toString() || ''

	//Bulk operations doesn't return ids, so I need to find it by search
	const pagination: Pagination = {
		page: 1,
		deleted: false,
		itemsPerPage: 1,
		orderKey: 'createdAt',
		orderValue: 'desc',
		search: fileName
	}
	const queryString = fromPaginationToQuery(pagination)

	const fileRes = await safeFetch(skFetch, {
		url: `${PUBLIC_API_URL}/file?${queryString}`,
		method: 'GET',
		body: data,
		isJson: false
	})
	let fileResJson: ApiResponseDto
	let file: FileDto
	if (fileRes && fileRes.status !== 200) {
		return fail(fileRes.status, {
			messages: generateMessages([{ message: ((await fileRes.json()) as ApiResponseDto).message }])
		})
	} else {
		fileResJson = await fileRes?.json()
		file = fileResJson.data[0]
	}

	const res = await safeFetch(skFetch, {
		url: `${PUBLIC_API_URL}/file/${file.id}`,
		method: 'DELETE',
		body: data,
		isJson: false
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
		apiData: { fileRemoved: resJson.data as FileDto },
		messages: generateMessages([{ message: resJson.message, variant: 'success' }])
	}
}
