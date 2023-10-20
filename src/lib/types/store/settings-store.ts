import type { Locales } from '$i18n/i18n-types'

export type SettingsStore = {
	language: Locales
	currency: 'USD' | 'BRL'
	theme: 'light' | 'dark'
}
