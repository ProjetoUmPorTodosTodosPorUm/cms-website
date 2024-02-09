import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data: { user, fields, messages } }) => {
	return { user, fields, messages }
}
