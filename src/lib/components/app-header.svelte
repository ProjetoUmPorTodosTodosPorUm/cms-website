<script lang="ts">
	import { goto } from '$app/navigation';
	import { getFromLocalStorage, saveToLocalStorage } from '$src/lib/utils/functions';
	import { createEventDispatcher, onMount } from 'svelte';

	import Icon from 'svelte-icons-pack';
	import FaSolidArrowLeft from 'svelte-icons-pack/fa/FaSolidArrowLeft';
	import FiRefreshCw from 'svelte-icons-pack/fi/FiRefreshCw';

	// Component Data
	export let name: string;
	export let buttonText: string | null = null;
	export let buttonLink: string | null = null;

	// Component Options
	export let showBackButton = true;
	export let showRefreshButton = true;

	let modeSwitchRef: HTMLButtonElement;
	let currentTheme = 'light';

	onMount(() => {
		const theme = getFromLocalStorage('theme') || currentTheme;
		currentTheme = theme === 'dark' ? 'dark' : 'light';
		applySavedTheme();
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

	function applySavedTheme() {
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

<div class="app-content-header">
	{#if showBackButton}
		<button on:click={() => history.back()} class="app-content-backButton">
			<Icon src={FaSolidArrowLeft} />
		</button>
	{/if}

	<h1 class="app-content-headerText">{name}</h1>
	{#if showRefreshButton}
		<button on:click={refresh} class="app-content-refresh" title="Atualizar">
			<Icon src={FiRefreshCw} />
		</button>
	{/if}
	<button
		bind:this={modeSwitchRef}
		on:click={onToggleStyle}
		class="mode-switch"
		title="Alternar Tema"
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
	{#if buttonText}
		<button on:click={click} class="app-content-headerButton">
			{buttonText}
		</button>
	{/if}
</div>
