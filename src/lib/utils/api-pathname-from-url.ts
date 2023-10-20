export function apiPathnameFromUrl(url: URL) {
	const groups = url.href.match(/\/([a-z-]+)\?/)
	return groups ? groups[1] : ''
}
