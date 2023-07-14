<script lang="ts">
	import '$lib/scss/components/app-actions.scss';
	import Pagination from '$components/pagination.svelte';
	import SearchInput from '$components/search-input.svelte';
	import type { UserStore } from '$lib/store/user';
	import { Role } from '$lib/enums';
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { generateMessages } from '$components/toast.svelte';
	import type { Locales } from '$src/i18n/i18n-types';
	import type { FieldDto, Pagination as PaginationType } from '$lib/types';
	import {
		fromPaginationToQuery,
		getFromLocalStorage,
		saveToLocalStorage
	} from '$lib/utils/functions';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['app-actions'];

	export let locale: Locales;

	// Component Data - forwarding
	export let page = 1;
	export let maxPage = 1;
	export let search = '';
	export let searchMinLength = 3;
	export let searchType: 'text' | 'number' = 'text';
	export let searchSpecificValue = '';
	export let searchSpecificField = '';
	export let messages: any = [];

	// Component Data
	export let totalCount = 1;
	export let showDeleted = true;
	export let showFilter = true;
	export let itemsSelected: string[] = [];
	export let isLoading = false;
	export let baseRoute = '';
	let fieldFilterRef: HTMLSelectElement;
	let fields: FieldDto[] = [];

	let userStore = getContext<UserStore>('userStore');
	let user = userStore.get('user');
	$: isAdmin = user.role === Role.ADMIN;
	$: isWebMaster = user.role === Role.WEB_MASTER;

	let filterMenuRef: HTMLDivElement;
	let listRef: HTMLButtonElement;
	let gridRef: HTMLButtonElement;

	let currentDataDisplay: 'list' | 'grid' = 'list';
	let screenSize: number;
	$: if (screenSize <= 575) {
		handleGridView();
	}

	// Events
	const dispatch = createEventDispatcher();
	const restore = () => dispatch('restore');
	const remove = () => dispatch('remove');
	const searchLoad = () => dispatch('searchLoad');
	const searchClear = () => dispatch('searchClear');

	onMount(async () => {
		applySavedDataDisplay();

		const accessToken = userStore.get('accessToken');
		axios.setAuth(accessToken);

		await loadNamespaceAsync(locale, 'app-actions');
		setLocale(locale);

		await loadFields();
	});

	function handleFilterMenu() {
		filterMenuRef.classList.toggle('active');
	}

	function handleGridView() {
		listRef.classList.remove('active');
		gridRef.classList.add('active');
		document.querySelector('.products-area-wrapper')?.classList.add('gridView');
		document.querySelector('.products-area-wrapper')?.classList.remove('tableView');

		saveToLocalStorage('dataDisplay', 'grid');
	}

	function handleListView() {
		listRef.classList.add('active');
		gridRef.classList.remove('active');
		document.querySelector('.products-area-wrapper')?.classList.remove('gridView');
		document.querySelector('.products-area-wrapper')?.classList.add('tableView');

		saveToLocalStorage('dataDisplay', 'list');
	}

	function applySavedDataDisplay() {
		const dataDisplay = getFromLocalStorage('dataDisplay') || currentDataDisplay;
		currentDataDisplay = dataDisplay === 'list' ? 'list' : 'grid';

		if (currentDataDisplay === 'list') {
			handleListView();
		} else {
			handleGridView();
		}
	}

	async function restoreAll() {
		try {
			isLoading = true;

			await axios.put(`${baseRoute}/restore`, { ids: itemsSelected });
			itemsSelected = [];
			restore();

			isLoading = false;
		} catch (error) {
			isLoading = false;
			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else {
				console.warn(error);
			}
		}
	}

	async function removeAll() {
		try {
			isLoading = true;

			await axios.delete(`${baseRoute}/hard-remove`, { data: { ids: itemsSelected } });
			itemsSelected = [];
			remove();

			isLoading = false;
		} catch (error) {
			isLoading = false;
			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else {
				console.warn(error);
			}
		}
	}

	async function loadFields() {
		const query = {
			itemsPerPage: 100,
			page: 1,
			deleted: false,
			orderKey: 'designation',
			orderValue: 'asc'
		} as PaginationType;
		const queryString = fromPaginationToQuery(query);

		try {
			isLoading = true;
			fields = (await axios.get(`/field?${queryString}`)).data.data;
			isLoading = false;
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else {
				console.warn(error);
			}
		}
	}

	function handleFilterApply() {
		const fieldId = fieldFilterRef.value;
		searchSpecificValue = fieldId;
		searchSpecificField = 'fieldId';
	}

	function handleFilterReset() {
		searchSpecificValue = '';
		searchSpecificField = '';
		fieldFilterRef.value = '';
	}
</script>

<svelte:window bind:innerWidth={screenSize} />

<div class="app-actions">
	<SearchInput
		bind:search
		minLength={searchMinLength}
		type={searchType}
		placeholder={i18n.searchInputPlaceHolder()}
		on:searchLoad={searchLoad}
		on:searchClear={searchClear}
	/>
	<span class="total-items" title={i18n.totalItemsTitle()}
		>{i18n.totalItemsText()}: {totalCount}</span
	>
	<Pagination bind:page {maxPage} />
	<div class="app-actions-wrapper">
		<div class="filter-button-wrapper">
			{#if isWebMaster && showFilter}
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
{#if isAdmin || isWebMaster}
	<div class="app-actions-admin">
		<div class="show-deleted">
			<span>{i18n.showDeletedText()}</span>
			<input bind:checked={showDeleted} type="checkbox" name="showDeleted" id="showDeleted" />
		</div>
		{#if showDeleted}
			<div class="buttons" in:fade out:fade>
				<button on:click={restoreAll}
					>{i18n.showDeletedRestoreButton()}
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
				<button on:click={removeAll}
					>{i18n.showDeletedHardRemoveButton()}
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}
