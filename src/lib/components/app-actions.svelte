<script lang="ts">
	import Pagination from '$components/pagination.svelte';
	import { MESSAGES, USER_TEMPLATE } from '$lib/constants';
	import { UserStore } from '$lib/store/user';
	import { Role } from '$lib/enums';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { getFromLocalStorage } from '$src/lib/utils/functions';
	import { generateMessages } from '$components/toast.svelte';

	// Component Data - forwarding
	export let page = 1;
	export let maxPage = 1;

	// Component Data
	export let totalCount = 1;
	export let showDeleted = true;
	export let showCleanButton = false;
	export let itemsSelected: string[] = [];
	export let isLoading = false;
	export let messages: any = [];
	export let baseRoute = '';

	let user = USER_TEMPLATE;
	let userStore: UserStore;
	$: isAdmin = user.role === Role.ADMIN;

	let filterMenuRef: HTMLDivElement;
	let listRef: HTMLButtonElement;
	let gridRef: HTMLButtonElement;

	// Events
	const dispatch = createEventDispatcher();
	const restore = () => dispatch('restore');
	const remove = () => dispatch('remove');
	const clean = () => dispatch('clean');

	onMount(() => {
		userStore = new UserStore();
		user = userStore.get('user');
		const accessToken = getFromLocalStorage('accessToken');
		axios.setAuth(accessToken);
	});

	function handleFilterMenu() {
		filterMenuRef.classList.toggle('active');
	}

	function handleGridView() {
		listRef.classList.remove('active');
		gridRef.classList.add('active');
		document.querySelector('.products-area-wrapper').classList.add('gridView');
		document.querySelector('.products-area-wrapper').classList.remove('tableView');
	}

	function handleListView() {
		listRef.classList.add('active');
		gridRef.classList.remove('active');
		document.querySelector('.products-area-wrapper').classList.remove('gridView');
		document.querySelector('.products-area-wrapper').classList.add('tableView');
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

	async function onClean() {
		const remove = confirm(MESSAGES.LOG.CLEAN);

		if (remove) {
			isLoading = true;
			try {
				await axios.delete('/log/clean');
				clean();
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
	}
</script>

<div class="app-content-actions">
	<input class="search-bar" placeholder="Search..." type="text" />
	<span class="total-items" title="Número total de items">Items: {totalCount}</span>
	<Pagination bind:page {maxPage} />
	<div class="app-content-actions-wrapper">
		<div class="filter-button-wrapper">
			<button on:click={handleFilterMenu} class="action-button filter jsFilter"
				><span>Filter</span><svg
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
				<label>Category</label>
				<select>
					<option>All Categories</option>
					<option>Furniture</option> <option>Decoration</option>
					<option>Kitchen</option>
					<option>Bathroom</option>
				</select>
				<label>Status</label>
				<select>
					<option>All Status</option>
					<option>Active</option>
					<option>Disabled</option>
				</select>
				<div class="filter-menu-buttons">
					<button class="filter-button reset"> Reset </button>
					<button class="filter-button apply"> Apply </button>
				</div>
			</div>
		</div>
		<button
			bind:this={listRef}
			on:click={handleListView}
			class="action-button list active"
			title="List View"
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
			title="Grid View"
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
{#if isAdmin}
	<div class="app-content-actions-admin">
		<div class="show-deleted">
			<span>Mostrar Deletados</span>
			<input bind:checked={showDeleted} type="checkbox" name="showDeleted" id="showDeleted" />
		</div>
		{#if showDeleted}
			<div class="buttons" in:fade out:fade>
				<button on:click={restoreAll}
					>Restaurar Selecionados
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
				<button on:click={removeAll}
					>Remover Selecionados
					{#if itemsSelected.length > 0}
						(x {itemsSelected.length})
					{/if}
				</button>
			</div>
		{/if}
		{#if showCleanButton}
		<div class="clean buttons">
			<button on:click={onClean}>Remover Todos os Logs</button>
		</div>
		{/if}
	</div>
{/if}
