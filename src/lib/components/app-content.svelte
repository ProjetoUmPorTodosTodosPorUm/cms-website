<script lang="ts">
	import '$scss/components/app-content.scss'
	import { AppHeader, AppActions, AppContentLoading } from '$components'
	import { createEventDispatcher } from 'svelte'
	import { navigating, page } from '$app/stores'
	import type { Locales } from '$i18n/i18n-types'

	// Component Data - forwarding
	export let name: string
	export let buttonText: string | null = null
	export let buttonLink: string | null = null
	export let maxPage = 1
	export let totalCount = 1
	export let showFilter = true
	export let locale: Locales

	// Component Options - forwarding
	export let showBackButton = true
	export let showRefreshButton = true

	// Component Options
	export let showActions = true
	export let isLoading = false
	$: combinedIsLoading = !!$navigating || isLoading

	// Events - forwarding
	const dispatch = createEventDispatcher()
	const click = () => dispatch('click')

	$: appHeader = {
		name,
		buttonText,
		buttonLink
	}
</script>

<div class="app-content">
	<AppHeader {...appHeader} {showBackButton} {showRefreshButton} {locale} on:click={click} />
	{#if showActions}
		<AppActions {totalCount} {maxPage} {locale} {showFilter} />
	{/if}
	<div class="products-area-wrapper tableView">
		<slot />
	</div>
	<AppContentLoading isLoading={combinedIsLoading} />
</div>
