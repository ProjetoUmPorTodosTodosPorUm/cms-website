<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Component Data
	export let search = '';
	export let placeholder = 'Pesquise Aqui...';
	export let minLength = 3;
	export let type: 'text' | 'number' = 'text';

	const dispatch = createEventDispatcher();
	const TYPING_COOL_DOWN = 300; // in MS
	const MIN_LENGTH = minLength;
	let typingTimer: NodeJS.Timeout;

	function startTypingCountDown() {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(() => {
			if (search.length >= MIN_LENGTH) {
				dispatch('searchLoad');
			} else {
				dispatch('searchClear');
			}
		}, TYPING_COOL_DOWN);
	}

	function clearTypingCountDown(event: KeyboardEvent) {
		filter(event);
		clearTimeout(typingTimer);
	}

	function filter(event: KeyboardEvent) {
		const whitelistKeys = ['Backspace', ',', '.'];

		if (type === 'number') {
			if (!whitelistKeys.includes(event.key) && isNaN(Number(event.key)) || event.code == 'Space') {
				event.preventDefault();
			}
		}
	}
</script>

<input
	bind:value={search}
	on:keyup={startTypingCountDown}
	on:keydown={clearTypingCountDown}
	{placeholder}
	type="text"
	class="search-bar"
/>
