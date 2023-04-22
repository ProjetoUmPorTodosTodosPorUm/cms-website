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

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.logs.list;
	$: sharedI18n = $LL.shared;

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

		await loadNamespaceAsync(data.locale, 'logs');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

	// Pagination config
	let pagination = {
		itemsPerPage: 20,
		page: 1,
		deleted: false,
		orderKey: 'createdAt',
		orderValue: 'desc',
		search: ''
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
	$: appHeader = {
		name: i18n.appHeader.name()
	};

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.ipLabel(),
			key: 'ip'
		},
		{
			label: i18n.collectionHeader.methodLabel(),
			key: 'method'
		},
		{
			label: i18n.collectionHeader.urlLabel(),
			key: 'url'
		},
		{
			label: i18n.collectionHeader.bodyLabel(),
			key: 'body'
		},
		{
			label: i18n.collectionHeader.filesLabel(),
			key: 'files'
		},
		{
			label: i18n.collectionHeader.queryLabel(),
			key: 'query'
		},
		{
			label: i18n.collectionHeader.statusCodeLabel(),
			key: 'statusCode'
		},
		{
			label: i18n.collectionHeader.userLabel(),
			key: 'user'
		},
		{
			label: sharedI18n.collectionHeader.createdAtLabel(),
			key: 'createdAt'
		},
		{
			label: sharedI18n.collectionHeader.deletedLabel(),
			key: 'deleted'
		}
	];

	$: collectionData = Object.entries(logData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.ipLabel(),
					key: 'ip',
					value: item.ip
				},
				{
					label: i18n.collectionHeader.methodLabel(),
					key: 'method',
					value: item.method,
					isTag: true
				},
				{
					label: i18n.collectionHeader.urlLabel(),
					key: 'url',
					value: item.url
				},
				{
					label: i18n.collectionHeader.bodyLabel(),
					key: 'body',
					value: item.body,
					isJson: true
				},
				{
					label: i18n.collectionHeader.filesLabel(),
					key: 'files',
					value: item.files,
					isJson: true
				},
				{
					label: i18n.collectionHeader.queryLabel(),
					key: 'query',
					value: item.query
				},
				{
					label: i18n.collectionHeader.statusCodeLabel(),
					key: 'statusCode',
					value: item.statusCode
				},
				{
					label: i18n.collectionHeader.userLabel(),
					key: 'user',
					value: item.user,
					isJson: true
				},
				{
					label: sharedI18n.collectionHeader.createdAtLabel(),
					key: 'createdAt',
					value: item.createdAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: sharedI18n.collectionHeader.deletedLabel(),
					key: 'deleted',
					value: item.deleted,
					transform: (value: string) => friendlyDateString(value, data.locale)
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
		pagination.search = searchInput;
	}

	function onSearchClear() {
		pagination.search = '';
	}
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/log'}
		locale={data.locale}
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
			locale={data.locale}
			on:click={onSort}
			bind:showDeleted={pagination.deleted}
		/>
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow
				rowCells={row}
				showOptions={false}
				locale={data.locale}
				bind:showDeleted={pagination.deleted}
			/>
		{/each}
	</AppContent>
</AppContainer>
