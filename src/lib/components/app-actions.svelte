<script lang="ts">
	import '$scss/components/app-actions.scss'
	import { Pagination, SearchInput } from '$components'
	import type { UserStore } from '$stores'
	import { getContext, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import { goto, invalidate } from '$app/navigation'
	import { enhance } from '$app/forms'
	import type { FieldDto } from '$types'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import type { Locales } from '$i18n/i18n-types'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['app-actions']

	export let locale: Locales
	$: fields = $page.data.fields || [] as FieldDto[]
	const userStore = getContext<UserStore>('user')

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

		await loadNamespaceAsync(locale, 'app-actions')
		setLocale(locale)

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
	<SearchInput placeholder={i18n.searchInputPlaceHolder()} />
	<span class="total-items" title={i18n.totalItemsTitle()}
		>{i18n.totalItemsText()}: {totalCount}</span
	>
	<Pagination {maxPage} />
	<div class="app-actions-wrapper">
		<div class="filter-button-wrapper">
			{#if userStore.isWebMaster() && showFilter}
				<button on:click={handleFilterMenu} class="action-button filter jsFilter"
					><span>{i18n.filterIconText()}</span><svg
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
					<label for="field-select">{i18n.filterFieldLabel()}</label>
					<select bind:this={fieldFilterRef} id="field-select">
						<option value="" disabled selected>{i18n.filterFieldLabel()}</option>
						{#each fields as field}
							<option value={field.id}>
								{field.abbreviation} - {field.designation}
							</option>
						{/each}
					</select>
					<div class="filter-menu-buttons">
						<button on:click={handleFilterReset} class="filter-button reset"
							>{i18n.filterResetButton()}</button
						>
						<button on:click={handleFilterApply} class="filter-button apply"
							>{i18n.filterApplyButton()}</button
						>
					</div>
				</div>
			{/if}
		</div>
		<button
			bind:this={listRef}
			on:click={handleListView}
			class="action-button list active"
			title={i18n.listViewTitle()}
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
			title={i18n.gridViewTitle()}
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
{#if userStore.isAdmin() || userStore.isWebMaster()}
	<div class="app-actions-admin">
		<div class="show-deleted">
			<span>{i18n.showDeletedText()}</span>
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
					>{i18n.showDeletedRestoreButton()}
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
				<form id="hard-remove" use:enhance method="POST" action="?/hardRemove" />
				<button type="submit" form="hard-remove"
					>{i18n.showDeletedHardRemoveButton()}
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}
