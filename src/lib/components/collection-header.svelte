<script lang="ts">
	import { page } from '$app/stores'
	import { goto, invalidate } from '$app/navigation'
	import type { ColumnCell } from '$types'

	// Component Options
	export let showOptions = true
	export let columns: ColumnCell[]
	$: showDeleted = $page.url.searchParams.get('deleted') == 'true' ? true : false

	async function onSort(orderKey: string) {
		const currentOrderKey = $page.url.searchParams.get('orderKey')
		const currentOrderValue = $page.url.searchParams.get('orderValue')
		let orderValue

		if (orderKey === currentOrderKey) {
			orderValue = currentOrderValue === 'desc' ? 'asc' : 'desc'
		} else {
			orderValue = 'desc'
		}

		$page.url.searchParams.set('orderKey', orderKey)
		$page.url.searchParams.set('orderValue', orderValue)
		await goto($page.url.href, { keepFocus: true })
		await invalidate('app:list-load')
	}
</script>

<div class="products-header">
	{#each columns as column}
		{#if column.key !== 'deleted'}
			<div class="product-cell image">
				{column.label}
				<button on:click={async () => await onSort(column.key)} class="sort-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"
						><path
							fill="currentColor"
							d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"
						/></svg
					>
				</button>
			</div>
		{:else if column.key === 'deleted' && showDeleted}
			<div class="product-cell image">
				{column.label}
				<button on:click={async () => await onSort(column.key)} class="sort-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"
						><path
							fill="currentColor"
							d="M496.1 138.3L375.7 17.9c-7.9-7.9-20.6-7.9-28.5 0L226.9 138.3c-7.9 7.9-7.9 20.6 0 28.5 7.9 7.9 20.6 7.9 28.5 0l85.7-85.7v352.8c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V81.1l85.7 85.7c7.9 7.9 20.6 7.9 28.5 0 7.9-7.8 7.9-20.6 0-28.5zM287.1 347.2c-7.9-7.9-20.6-7.9-28.5 0l-85.7 85.7V80.1c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v352.8l-85.7-85.7c-7.9-7.9-20.6-7.9-28.5 0-7.9 7.9-7.9 20.6 0 28.5l120.4 120.4c7.9 7.9 20.6 7.9 28.5 0l120.4-120.4c7.8-7.9 7.8-20.7-.1-28.5z"
						/></svg
					>
				</button>
			</div>
		{/if}
	{/each}
	{#if showOptions}
		<div class="product-cell">Opções</div>
	{/if}
	{#if showDeleted}
		<div class="product-cell">Selecionar</div>
	{/if}
</div>
