<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'

	// Constants
	const TYPING_COOL_DOWN = 300 // in MS
	const MIN_LENGTH = 3

	// Component Data
	export let placeholder = 'Pesquise Aqui...'
	export let type: 'text' | 'number' = 'text'
	let search = $page.url.searchParams.get('search') || ''
	$: search, updateSearch()

	let typingTimer: NodeJS.Timeout

	function startTypingCountDown() {
		clearTimeout(typingTimer)
		typingTimer = setTimeout(async () => {
			if (search.length >= MIN_LENGTH) {
				await goto($page.url.href, { keepFocus: true })
				await invalidate('app:list-load')
			} else if (search.length === 0) {
				await goto($page.url.href, { keepFocus: true })
				await invalidate('app:list-load')
			}
		}, TYPING_COOL_DOWN)
	}

	function clearTypingCountDown(event: KeyboardEvent) {
		filter(event)
		clearTimeout(typingTimer)
	}

	function filter(event: KeyboardEvent) {
		const whitelistKeys = ['Backspace', ',', '.']

		if (type === 'number') {
			if (
				(!whitelistKeys.includes(event.key) && isNaN(Number(event.key))) ||
				event.code == 'Space'
			) {
				event.preventDefault()
			}
		}
	}

	function updateSearch() {
		if (search.length >= MIN_LENGTH) {
			$page.url.searchParams.set('search', search)
		} else {
			$page.url.searchParams.delete('search')
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
