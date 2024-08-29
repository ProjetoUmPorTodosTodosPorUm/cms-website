type safeFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type safeFetchOptions = {
	url: RequestInfo
	method?: safeFetchMethod
	headers?: HeadersInit
	body?: any
	isJson?: boolean
	isMultipart?: boolean
}

// Only Server Side
export async function safeFetch(
	svelteKitFetch: typeof fetch,
	options: safeFetchOptions
) {
	// Seting defaults if empty
	options.method = options.method ?? 'GET'
	options.isJson = options.isJson ?? true

	const fetchOptions: Omit<safeFetchOptions, 'url'> = {
		method: options.method,
		headers: {
			Accept: 'application/json',
			...options.headers
		}
	}

	if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
		if (options.body) {
			if (options.isJson) {
				fetchOptions.headers = {
					...fetchOptions.headers,
					'Content-Type': 'application/json'
				}
				fetchOptions.body = JSON.stringify(options.body)
			} else if (options.isMultipart) {
				fetchOptions.headers = {
					...fetchOptions.headers,
				}
				const formData = new FormData()
				for (const [field, value] of Object.entries(options.body)) {
					// File
					if (typeof value === 'object' && (value as any)?.type === 'application/octet-stream') {
						if ((value as any)?.size !== 0) {
							formData.append(field, value as any)
						}
					} else if (value) {
						formData.append(field, value as any)
					}
				}
				fetchOptions.body = formData
			} else {
				fetchOptions.headers = {
					...fetchOptions.headers
				}
				fetchOptions.body = options.body
			}
		}
	}

	return await svelteKitFetch(options.url, fetchOptions)
}
