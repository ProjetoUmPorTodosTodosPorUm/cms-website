import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { safeFetch } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'

export const load: PageServerLoad = async ({ fetch, locals }) => {
	await safeFetch(fetch, {
        url: `${PUBLIC_API_URL}/auth/sign-out`,
        method: 'POST'
    })


	const { session } = locals
    await session.destroy()
    redirect(307, '/login')
}
