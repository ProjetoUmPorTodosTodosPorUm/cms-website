import { writable, get, type Writable } from 'svelte/store'
import { browser } from '$app/environment'

export class BaseStore<T> {
	public subscribe
	protected store: Writable<T>

	constructor(defaultStore: any) {
		this.store = writable(defaultStore)
		this.subscribe = this.store.subscribe
	}

	get(key?: string) {
		let keys: string[] = []
		if (typeof key === 'string' && key.match(/\./)) {
			keys = key.split('.')
		}

		if (keys.length) {
			// @ts-ignore
			return get(this.store)[keys[0]][keys[1]]
		} else if (key) {
			// @ts-ignore
			return get(this.store)[key]
		} else {
			return get(this.store)
		}
	}

	saveToLocalStorage(key: string, data: any) {
		if (browser) {
			if (data !== null) {
				localStorage.setItem(key, JSON.stringify(data))
			} else {
				localStorage.removeItem(key)
			}
		}
	}

	getFromLocalStorage(key: string, stringify = true) {
		const data = browser ? localStorage.getItem(key) : null

		if (data && data.length && stringify) {
			return JSON.parse(data)
		} else if (data && data.length) {
			return data
		} else {
			return ''
		}
	}
}
