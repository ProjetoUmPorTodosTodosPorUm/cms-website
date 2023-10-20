import type { LayoutLoad } from './$types'
import { loadLocaleAsync } from '$i18n/i18n-util.async'
import LL, { setLocale } from '$i18n/i18n-svelte'

export const load: LayoutLoad = async ({ data: { locale, user, fields, messages } }) => {
	// load dictionary into memory
	await loadLocaleAsync(locale)

	// if you need to output a localized string in a `load` function,
	// you always need to call `setLocale` right before you access the `LL` store
	setLocale(locale)
	// get the translation functions value from the store

	// pass locale to the "rendering context"
	return { locale, user, fields, messages }
}
