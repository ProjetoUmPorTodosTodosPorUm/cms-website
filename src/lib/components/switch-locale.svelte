<script lang="ts">
	import '$scss/components/switch-locale.scss'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { setLocale, locale } from '$i18n/i18n-svelte'
	import type { Locales, Namespaces } from '$i18n/i18n-types'
	import { locales } from '$i18n/i18n-util'
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import { replaceLocaleInUrl } from '$utils'
	import { getContext, createEventDispatcher } from 'svelte'
	import type { SettingsStore } from '$stores'

	//icons
	import Icon from 'svelte-icons-pack/Icon.svelte'
	import IoLanguage from 'svelte-icons-pack/io/IoLanguage'

	const dispatch = createEventDispatcher()

	export let namespaces: Namespaces[] = []
	let language: string
	let settingsStore: SettingsStore = getContext('settings')

	settingsStore.subscribe((data) => {
		language = data.language
	})

	async function switchLocale(newLocale: string, updateHistoryState = true) {
		if (!newLocale || $locale === newLocale) return

		// Load Namespaces
		namespaces.forEach(async (ns) => {
			await loadNamespaceAsync(newLocale as Locales, ns)
		})

		// select locale
		setLocale(newLocale as Locales)
		// update `lang` attribute
		document.querySelector('html')?.setAttribute('lang', newLocale)
		if (updateHistoryState) {
			// update url to reflect locale changes
			history.pushState({ locale: newLocale }, '', replaceLocaleInUrl($page.url, newLocale))
		}
		// run the `load` function again
		invalidateAll()

		// updates store
		settingsStore.updateLanguage(newLocale as Locales)

		// send event
		onSwitchLocale(newLocale as Locales)
	}

	function onSwitchLocale(newLocale: Locales) {
		dispatch('switchLocale', {
			newLocale
		})
	}
</script>

<div class="switch-locale">
	<Icon src={IoLanguage} className="icon" />
	<select value={language} name="lang" on:change={(v) => switchLocale(v.currentTarget.value)}>
		{#each locales as L}
			<option value={L}>{L}</option>
		{/each}
	</select>
</div>
