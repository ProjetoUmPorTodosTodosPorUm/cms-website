<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';

	import { getContext, onMount } from 'svelte';
	import type { LogDto, Pagination, RowCell } from '$lib/types';
	import { delay, friendlyDateString, fromPaginationToQuery } from '$lib/utils/functions';

	import { generateMessages } from '$components/toast.svelte';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { UserStore } from '$src/lib/store/user';
	import type { PageData } from './$types';

	export let data: PageData;

	let logData: LogDto[] = [];
	let userStore = getContext<UserStore>('userStore');
	let totalCount = 1;
	let totalPages = 1;
	let isReady = false;

	let isLoading = true;
	let messages: any[] = [];
	let itemsSelected: string[] = [];

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
		orderValue: 'desc',
		search: '',
	} as Pagination;
	let searchInput = '';

	$: queryString = fromPaginationToQuery(pagination);
	$: queryString, loadData();

	async function loadData() {
		while (!isReady) {
			await delay(50);
		}

		try {
			isLoading = true;

			const res = await axios.get(`log?${queryString}`);
			logData = res.data.data;
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
		name: 'Logs'
	};

	// Collection Header
	const collectionHeader = [
		{
			label: 'IP',
			key: 'ip'
		},
		{
			label: 'METHOD',
			key: 'method'
		},
		{
			label: 'URL',
			key: 'url'
		},
		{
			label: 'Body',
			key: 'body'
		},
		{
			label: 'Files',
			key: 'files'
		},
		{
			label: 'Query',
			key: 'query'
		},
		{
			label: 'Status Code',
			key: 'statusCode'
		},
		{
			label: 'Usuário',
			key: 'user'
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

	$: collectionData = Object.entries(logData).map(
		([key, log]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: log.id
				},
				{
					label: 'IP',
					key: 'ip',
					value: log.ip
				},
				{
					label: 'METHOD',
					key: 'method',
					value: log.method,
					isTag: true
				},
				{
					label: 'URL',
					key: 'url',
					value: log.url
				},
				{
					label: 'Body',
					key: 'body',
					value: log.body,
					isJson: true
				},
				{
					label: 'Files',
					key: 'files',
					value: log.files,
					isJson: true
				},
				{
					label: 'Query',
					key: 'query',
					value: log.query
				},
				{
					label: 'Status Code',
					key: 'statusCode',
					value: log.statusCode
				},
				{
					label: 'Usuário',
					key: 'user',
					value: log.user,
					isJson: true
				},
				{
					label: 'Criado Em',
					key: 'createdAt',
					value: log.createdAt,
					transform: friendlyDateString
				},
				{
					label: 'Deletado Em',
					key: 'deleted',
					value: log.deleted,
					transform: friendlyDateString
				}
			] as RowCell[]
	);

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

	function onSearchLoad() {
		pagination.search = searchInput
	}

	function onSearchClear() {
		pagination.search = '';
	}
</script>

<svelte:head>
	<title>Logs</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/log'}
		on:refresh={loadData}
		on:restore={loadData}
		on:remove={loadData}
		on:searchLoad={onSearchLoad}
		on:searchClear={onSearchClear}
		bind:search={searchInput}
		bind:page={pagination.page}
		bind:showDeleted={pagination.deleted}
		bind:itemsSelected
		bind:isLoading
	>
		<CollectionHeader
			columns={collectionHeader}
			showOptions={false}
			on:click={onSort}
			bind:showDeleted={pagination.deleted}
		/>
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} showOptions={false} bind:showDeleted={pagination.deleted} />
		{/each}
	</AppContent>
</AppContainer>
