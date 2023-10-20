import type { Pagination } from '../types'

export function fromPaginationToQuery(pagination: Pagination) {
	const urlSearchParams = new URLSearchParams()
	for (const key of Object.keys(pagination) as (keyof Pagination)[]) {
		if (pagination[key]) {
			urlSearchParams.set(key, pagination[key])
		}
	}
	return urlSearchParams.toString()
}
