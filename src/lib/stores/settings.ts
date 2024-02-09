import { BaseStore } from '$stores/base'
import type { SettingsStore as SettingsStoreType } from '$lib/types'

export class SettingsStore extends BaseStore<SettingsStoreType> {
	static storeDefault = {
		currency: 'BRL',
		theme: 'light',
		isReady: false
	} as SettingsStoreType

	constructor() {
		super(SettingsStore.storeDefault)
		this.init()
	}

	async init() {
		const theme = this.getFromLocalStorage('settings.theme') || 'light'
		this.updateTheme(theme)

		this.store.update((data) => ({
			...data,
			isReady: true
		}))
	}

	updateTheme(theme: 'light' | 'dark') {
		this.store.update((data) => ({
			...data,
			theme
		}))
		this.saveToLocalStorage('settings.theme', theme)
	}
}
