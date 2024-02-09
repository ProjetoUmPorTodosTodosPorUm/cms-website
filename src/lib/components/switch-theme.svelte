<script lang="ts">
	import '$scss/components/switch-theme.scss'
	import { getContext, onMount } from 'svelte'
	import type { SettingsStore } from '$stores'

	let settingsStore = getContext<SettingsStore>('settings')
	let modeSwitchRef: HTMLButtonElement
	let currentTheme: 'light' | 'dark' = 'light'

	onMount(async () => {
		applySavedTheme()
	})

	function applySavedTheme() {
		const theme = settingsStore.get('theme') || currentTheme
		currentTheme = theme === 'dark' ? 'dark' : 'light'

		const key = currentTheme == 'light' ? 'add' : 'remove'
		document.documentElement.classList[key]('light')
		modeSwitchRef.classList[key]('active')
	}

	function onToggleStyle() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
		document.documentElement.classList.toggle('light')
		modeSwitchRef.classList.toggle('active')
		settingsStore.updateTheme(currentTheme)
	}
</script>

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
