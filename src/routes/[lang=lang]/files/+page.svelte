<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';

	import { getContext, onMount } from 'svelte';
	import type { RowCell, FileDto, Pagination } from '$lib/types';
	import { delay, friendlyDateString, fromPaginationToQuery, removeItemById } from '$lib/utils/functions';

	import { generateMessages } from '$components/toast.svelte';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { TEMPLATES } from '$src/lib/constants';
	import type { UserStore } from '$src/lib/store/user';
	import type { PageData } from './$types';

	export let data: PageData;

	let fileData: FileDto[] = [];
	let userStore = getContext<UserStore>('userStore');
	let totalCount = 1;
	let totalPages = 1;
	let isReady = false;

	let isLoading = true;
	let messages: any[] = [];
	let itemsSelected: string[] = [];
	let showEdit = false;

	onMount(async () => {
		const accessToken = userStore.get('accessToken');
		axios.setAuth(accessToken);
		isReady = true;
	});

	// Pagination config
	let pagination = {
		itemsPerPage: 20,
		page: 1,
		deleted: false,
		orderKey: 'createdAt',
		orderValue: 'desc'
	} as Pagination;

	$: queryString = fromPaginationToQuery(pagination);
	$: queryString, loadData();

	async function loadData() {
		while (!isReady) {
			await delay(50);
		}

		try {
			isLoading = true;

			const res = await axios.get(`file?${queryString}`);
			fileData = res.data.data;
			totalCount = res.headers.get('x-total-count');
			totalPages = res.headers.get('x-total-pages');

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

	// App Header
	const appHeader = {
		name: 'Arquivos'
	};

	// Collection Header
	const collectionHeader = [
		{
			label: 'Nome',
			key: 'name'
		},
		{
			label: 'MimeType',
			key: 'mimeType'
		},
		{
			label: 'Tamanho',
			key: 'size'
		},
		{
			label: 'Criado Em',
			key: 'createdAt'
		},
		{
			label: 'Deletado Em',
			key: 'deleted'
		}
	];
	const numberFormat = new Intl.NumberFormat('en', {
		notation: 'compact',
		style: 'unit',
		unit: 'byte',
		unitDisplay: 'narrow'
	});

	// Collection Data
	$: collectionData = Object.entries(fileData).map(
		([key, file]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: file.id
				},
				{
					label: 'Nome',
					key: 'name',
					value: file.name,
					isStatic: true
				},
				{
					label: 'MimeType',
					key: 'mimeType',
					value: file.mimeType,
					isTag: true
				},
				{
					label: 'Tamanho',
					key: 'size',
					value: file.size,
					transform: numberFormat.format
				},
				{
					label: 'Criado Em',
					key: 'createdAt',
					value: file.createdAt,
					transform: friendlyDateString
				},
				{
					label: 'Deletado Em',
					key: 'deleted',
					value: file.deleted,
					transform: friendlyDateString
				}
			] as RowCell[]
	);

	// On Event Functions
	async function handleRemove(event: CustomEvent) {
		const { id, data } = event.detail;
		const remove = confirm(TEMPLATES.REMOVE.FILE(data.name));

		if (remove) {
			isLoading = true;
			try {
				await axios.delete(`/file/${id}`);
				fileData = removeItemById(id, data);
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

	function handleSelect(event: CustomEvent) {
		const id = event.detail;
		if (itemsSelected.indexOf(id) > -1) {
			itemsSelected = [...itemsSelected.filter((itemId) => itemId !== id)];
		} else {
			itemsSelected = [...itemsSelected, id];
		}
	}

	function onSort(event: CustomEvent) {
		const key = event.detail;
		let orderValue;

		if (key === pagination.orderKey) {
			orderValue = pagination.orderValue === 'desc' ? 'asc' : 'desc';
		} else {
			orderValue = 'desc';
		}

		pagination = {
			...pagination,
			orderKey: key,
			orderValue
		} as Pagination;
	}
</script>

<svelte:head>
	<title>Files</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/file'}
		on:refresh={loadData}
		on:restore={loadData}
		on:remove={loadData}
		bind:page={pagination.page}
		bind:showDeleted={pagination.deleted}
		bind:itemsSelected
		bind:isLoading
	>
		<CollectionHeader
			columns={collectionHeader}
			on:click={onSort}
			bind:showDeleted={pagination.deleted}
		/>
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow
				rowCells={row}
				{showEdit}
				on:remove={handleRemove}
				on:select={handleSelect}
				bind:showDeleted={pagination.deleted}
			/>
		{/each}
	</AppContent>
</AppContainer>
