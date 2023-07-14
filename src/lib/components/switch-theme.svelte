<script lang="ts">
	import '$lib/scss/components/switch-theme.scss';
	import { getFromLocalStorage, saveToLocalStorage } from '$src/lib/utils/functions';
	import { onMount } from 'svelte';
	import type { Locales } from '$src/i18n/i18n-types';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['app-header'];

	let modeSwitchRef: HTMLButtonElement;
	let currentTheme = 'light';

	export let locale: Locales;

	onMount(async () => {
		applySavedTheme();

		await loadNamespaceAsync(locale, 'app-header');
		setLocale(locale);
	});

	function applySavedTheme() {
		const theme = getFromLocalStorage('theme') || currentTheme;
		currentTheme = theme === 'dark' ? 'dark' : 'light';

		const key = currentTheme == 'light' ? 'add' : 'remove';
		document.documentElement.classList[key]('light');
		modeSwitchRef.classList[key]('active');
	}

	function onToggleStyle() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		document.documentElement.classList.toggle('light');
		modeSwitchRef.classList.toggle('active');
		saveToLocalStorage('theme', currentTheme);
	}
</script>

<button
	bind:this={modeSwitchRef}
	on:click={onToggleStyle}
	class="mode-switch"
	title={i18n.switchThemeButtonTitle()}
>
	<svg
		class="moon"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<defs />
		<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
	</svg>
</button>
