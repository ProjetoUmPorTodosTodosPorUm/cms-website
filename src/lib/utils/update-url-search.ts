type options = {
	key: string
	value?: any
	delete?: boolean
}

export function updateUrlSearch(href: string, options: options | options[]) {
	const url = new URL(href)
	if (Array.isArray(options)) {
		for (let i = 0; i < options.length; i++) {
			if (options[i].delete) {
				url.searchParams.delete(options[i].key)
			} else {
				url.searchParams.set(options[i].key, options[i].value)
			}
		}
	} else {
		if (options.delete) {
			url.searchParams.delete(options.key)
		} else {
			url.searchParams.set(options.key, options.value)
		}
	}
	document.location.href = url.href
}
