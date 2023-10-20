import { BaseStore } from '$stores/base'
import type { SettingsStore as SettingsStoreType } from '$lib/types'
import type { Locales } from '$i18n/i18n-types'

export class SettingsStore extends BaseStore<SettingsStoreType> {
	static storeDefault = {
		language: 'pt-BR',
		currency: 'BRL',
		theme: 'light',
		isReady: false
	} as SettingsStoreType

	constructor() {
		super(SettingsStore.storeDefault)
		this.init()
	}

	async init() {
		const language = this.getFromLocalStorage('settings.language') || 'pt-BR'
		const theme = this.getFromLocalStorage('settings.theme') || 'light'

		this.updateLanguage(language)
		this.updateTheme(theme)

		this.store.update((data) => ({
			...data,
			isReady: true
		}))
	}

	updateLanguage(language: Locales) {
		this.store.update((data) => ({
			...data,
			language: language ?? 'pt-BR',
			currency: language === 'pt-BR' ? 'BRL' : 'USD'
		}))
		this.saveToLocalStorage('settings.language', language ?? 'pt-BR')
	}

	updateTheme(theme: 'light' | 'dark') {
		this.store.update((data) => ({
			...data,
			theme
		}))
		this.saveToLocalStorage('settings.theme', theme)
	}
}
