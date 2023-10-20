<script lang="ts">
	import '$scss/components/collection-row-placeholder.scss'
	import { goto } from '$app/navigation'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import type { Locales } from '$i18n/i18n-types'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	import { onMount } from 'svelte'
	$: i18n = $LL['collection-row-placeholder']

	export let locale: Locales

	export let description = ''
	export let buttonText = 'Adicionar'
	export let buttonLink = ''

	async function onClick() {
		await goto(buttonLink)
	}

	onMount(async () => {
		await loadNamespaceAsync(locale, 'collection-row-placeholder')
		setLocale(locale)
	})
</script>

<div class="products-row-placehoder">
	<p>{description || i18n.description()}</p>
	<button on:click={onClick}>{buttonText}</button>
</div>
