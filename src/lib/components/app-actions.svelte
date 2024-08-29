<script lang="ts">
	import '$scss/components/app-actions.scss'
	import { Pagination, SearchInput } from '$components'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import { goto, invalidate } from '$app/navigation'
	import { enhance } from '$app/forms'
	import type { FieldDto } from '$types'
	import { Role } from '../enums'

	$: fields = $page.data.fields || ([] as FieldDto[])
	$: user = $page.data.user

	// Component Data - forwarding
	export let maxPage = 1
	export let searchSpecificValue = ''
	export let searchSpecificField = ''

	// Component Data
	export let totalCount = 1
	export let showFilter = true
	let itemsSelected: string[] = []
	let showDeleted = false

	let fieldFilterRef: HTMLSelectElement
	let filterMenuRef: HTMLDivElement
	let listRef: HTMLButtonElement
	let gridRef: HTMLButtonElement

	let currentDataDisplay: 'list' | 'grid' = 'list'
	let screenSize: number
	$: if (screenSize <= 575) {
		handleGridView()
	}

	onMount(async () => {
		applySavedDataDisplay()

		const deleted = Boolean($page.url.searchParams.get('deleted'))
		if (deleted !== showDeleted) {
			onShowDeleted()
		}
	})

	function handleFilterMenu() {
		filterMenuRef.classList.toggle('active')
	}

	function handleGridView() {
		listRef.classList.remove('active')
		gridRef.classList.add('active')
		document.querySelector('.products-area-wrapper')?.classList.add('gridView')
		document.querySelector('.products-area-wrapper')?.classList.remove('tableView')

		//saveToLocalStorage('dataDisplay', 'grid');
	}

	function handleListView() {
		listRef.classList.add('active')
		gridRef.classList.remove('active')
		document.querySelector('.products-area-wrapper')?.classList.remove('gridView')
		document.querySelector('.products-area-wrapper')?.classList.add('tableView')

		//saveToLocalStorage('dataDisplay', 'list');
	}

	function applySavedDataDisplay() {
		const dataDisplay = /* getFromLocalStorage('dataDisplay')  ||*/ currentDataDisplay
		currentDataDisplay = dataDisplay === 'list' ? 'list' : 'grid'

		if (currentDataDisplay === 'list') {
			handleListView()
		} else {
			handleGridView()
		}
	}

	function handleFilterApply() {
		const fieldId = fieldFilterRef.value
		searchSpecificValue = fieldId
		searchSpecificField = 'fieldId'
	}

	function handleFilterReset() {
		searchSpecificValue = ''
		searchSpecificField = ''
		fieldFilterRef.value = ''
	}

	async function onShowDeleted() {
		showDeleted = !showDeleted

		if (showDeleted) {
			$page.url.searchParams.set('deleted', 'true')
		} else {
			$page.url.searchParams.delete('deleted')
		}

		await goto($page.url.href)
		await invalidate('app:list-load')
	}
</script>

<svelte:window bind:innerWidth={screenSize} />

<div class="app-actions">
	<SearchInput placeholder="Pesquise Aqui..." />
	<span class="total-items" title="Número total de items">Items: {totalCount}</span>
	<Pagination {maxPage} />
	<div class="app-actions-wrapper">
		<div class="filter-button-wrapper">
			{#if user?.role === Role.WEB_MASTER && showFilter}
				<button on:click={handleFilterMenu} class="action-button filter jsFilter"
					><span>Filtro</span><svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-filter"
						><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg
					></button
				>
				<div bind:this={filterMenuRef} class="filter-menu">
					<label for="field-select">Campo Missionário</label>
					<select bind:this={fieldFilterRef} id="field-select">
						<option value="" disabled selected>Campo Missionário</option>
						{#each fields as field}
							<option value={field.id}>
								{field.abbreviation} - {field.designation}
							</option>
						{/each}
					</select>
					<div class="filter-menu-buttons">
						<button on:click={handleFilterReset} class="filter-button reset">Reiniciar</button>
						<button on:click={handleFilterApply} class="filter-button apply">Aplicar</button>
					</div>
				</div>
			{/if}
		</div>
		<button
			bind:this={listRef}
			on:click={handleListView}
			class="action-button list active"
			title="Visualizar em lista"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-list"
				><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line
					x1="8"
					y1="18"
					x2="21"
					y2="18"
				/><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line
					x1="3"
					y1="18"
					x2="3.01"
					y2="18"
				/></svg
			>
		</button>
		<button
			bind:this={gridRef}
			on:click={handleGridView}
			class="action-button grid"
			title="Visualizar em grid"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-grid"
				><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect
					x="14"
					y="14"
					width="7"
					height="7"
				/><rect x="3" y="14" width="7" height="7" /></svg
			>
		</button>
	</div>
</div>
{#if user?.role === Role.ADMIN || user?.role === Role.WEB_MASTER}
	<div class="app-actions-admin">
		<div class="show-deleted">
			<span>Mostrar Removidos</span>
			<input
				checked={showDeleted}
				on:click={onShowDeleted}
				type="checkbox"
				name="showDeleted"
				id="showDeleted"
			/>
		</div>
		{#if showDeleted}
			<div class="buttons" in:fade out:fade>
				<form id="restore" use:enhance method="POST" action="?/restore" />
				<button type="submit" form="restore"
					>Restaurar Selecionados
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
				<form id="hard-remove" use:enhance method="POST" action="?/hardRemove" />
				<button type="submit" form="hard-remove"
					>Remover Selecionados
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}
