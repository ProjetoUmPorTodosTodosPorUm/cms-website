import type { ApiResponseDto } from '$types'
import { generateMessages, safeFetch } from '$utils'
import { PUBLIC_API_URL } from '$env/static/public'
import type { Cookies } from '@sveltejs/kit'

export async function fieldsLoad(
    skFetch: typeof fetch,
    cookies: Cookies,
) {
    // do not trust user input

    const res = await safeFetch(skFetch, cookies, {
        url: `${PUBLIC_API_URL}/field?itemsPerPage=100`
    })


    if (res && res.status !== 200) {
        return {
            fields: [],
            messages: generateMessages([{ message: ((await res.json()) as ApiResponseDto).message }]),
        }
    } else if (res) {
        const resJson = (await res.json()) as ApiResponseDto

        return {
            fields: resJson.data,
        }
    }

    // fail safe
    return {
        fields: [],
    }
}