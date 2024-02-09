export function fromStringToISOLocale(dateiso: string) {
	const date = new Date(dateiso)
	const lastIndex = date.toISOString().indexOf('T') + 'T00:00'.length
	date.setMinutes(-date.getTimezoneOffset())
	return date.toISOString().substring(0, lastIndex)
}
