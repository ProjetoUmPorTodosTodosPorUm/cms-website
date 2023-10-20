// Only Server Side
import type { Pagination } from '$types'

export function fromSearchToPagination(url: URL) {
	return {
		itemsPerPage: Number(url.searchParams.get('itemsPerPage')) || 20,
		page: Number(url.searchParams.get('page')) || 1,
		deleted: url.searchParams.get('deleted') == 'true' ? true : false,
		orderKey: url.searchParams.get('orderKey') || 'createdAt',
		orderValue: url.searchParams.get('orderValue') == 'desc' ? 'desc' : 'asc',
		search: url.searchParams.get('search') || ''
	} as Pagination
}
