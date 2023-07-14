<script lang="ts">
	import '$lib/scss/components/app-header.scss';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Locales } from '$src/i18n/i18n-types';

	import Icon from 'svelte-icons-pack';
	import FaSolidArrowLeft from 'svelte-icons-pack/fa/FaSolidArrowLeft';
	import FiRefreshCw from 'svelte-icons-pack/fi/FiRefreshCw';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['app-header'];

	export let locale: Locales;

	// Component Data
	export let name: string;
	export let buttonText: string | null = null;
	export let buttonLink: string | null = null;

	// Component Options
	export let showBackButton = true;
	export let showRefreshButton = true;

	onMount(async () => {
		await loadNamespaceAsync(locale, 'app-header');
		setLocale(locale);
	});

	// Events
	const dispatch = createEventDispatcher();
	const refresh = () => dispatch('refresh');
	const click = () => {
		if (buttonLink) {
			goto(buttonLink);
		}
		dispatch('click');
	};
</script>

<div class="app-header">
	{#if showBackButton}
		<button on:click={() => history.back()} class="back">
			<Icon src={FaSolidArrowLeft} />
		</button>
	{/if}

	<h1 class="text">{name}</h1>
	{#if showRefreshButton}
		<button on:click={refresh} class="refresh" title={i18n.refreshButtonTitle()}>
			<Icon src={FiRefreshCw} />
		</button>
	{/if}

	{#if buttonText}
		<button on:click={click} class="action">
			{buttonText}
		</button>
	{/if}
</div>
