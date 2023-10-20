<script lang="ts">
	import '$scss/components/pagination.scss'
	import { page as pageSvelte } from '$app/stores'
	import { goto, invalidate } from '$app/navigation'

	import Icon from 'svelte-icons-pack'
	import FiChevronLeft from 'svelte-icons-pack/fi/FiChevronLeft'
	import FiChevronRight from 'svelte-icons-pack/fi/FiChevronRight'
	import { onMount } from 'svelte'

	const PAGES_AROUND_CURRENT = 1

	export let maxPage = 1
	let page = 1
	let pages = Array(maxPage)

	$: maxPage, updatePages()
	$: page, updatePages()

	onMount(async () => {
		const currentPage = Number($pageSvelte.url.searchParams.get('page')) || 1
		if (currentPage !== page) {
			page = currentPage
		}
	})

	// svelte cant handle just using Array(maxPage)
	function updatePages() {
		pages = []
		for (let i = 0; i < maxPage; i++) {
			pages = [...pages, 0]
		}
	}

	async function onPreviousPage() {
		page = page > 1 ? page - 1 : page
		await navigateToPage(page)
	}

	async function onNextPage() {
		page = page < maxPage ? page + 1 : page
		await navigateToPage(page)
	}

	async function onPageSelect(selectedPage: number) {
		page = selectedPage
		await navigateToPage(page)
	}

	function isPrintablePage(pageNumber: number) {
		return (
			(pageNumber <= page + PAGES_AROUND_CURRENT && pageNumber >= page - PAGES_AROUND_CURRENT) ||
			pageNumber == 1 ||
			pageNumber == maxPage
		)
	}

	function isPrintableAction(pageNumber: number) {
		return (
			pageNumber <= page + PAGES_AROUND_CURRENT + 1 && pageNumber >= page - PAGES_AROUND_CURRENT - 1
		)
	}

	async function navigateToPage(page: number) {
		$pageSvelte.url.searchParams.set('page', String(page))
		await goto($pageSvelte.url.href)
		await invalidate('app:list-load')
	}
</script>

<div class="pagination">
	{#if page != 1}
		<button class="item previous" on:click={onPreviousPage}>
			<Icon src={FiChevronLeft} />
		</button>
	{/if}
	{#each pages as _, index (index)}
		{#if isPrintablePage(index + 1)}
			<button
				class={`item pages ${index + 1 == page ? 'active' : ''}`}
				on:click={() => onPageSelect(index + 1)}
			>
				{index + 1}
			</button>
		{:else if isPrintableAction(index + 1)}
			<button class="item action">
				<p>...</p>
			</button>
		{/if}
	{/each}
	{#if pages.length === 0}
		<button class="item pages active" on:click={() => onPageSelect(1)}>1</button>
	{/if}
	{#if page != maxPage}
		<button class="item next" on:click={onNextPage}>
			<Icon src={FiChevronRight} />
		</button>
	{/if}
</div>
