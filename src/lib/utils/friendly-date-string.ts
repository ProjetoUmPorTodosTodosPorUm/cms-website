export function friendlyDateString(date: Date | string, locales: Intl.LocalesArgument = 'pt-BR') {
	if (!(date instanceof Date)) {
		date = new Date(date)
	}
	return date.toLocaleDateString(locales, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	})
}
