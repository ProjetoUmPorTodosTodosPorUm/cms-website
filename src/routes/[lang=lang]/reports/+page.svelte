<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';
	import CollectionRowPlaceholder from '$components/collection-row-placeholder.svelte';
	import Modal from '$components/modal.svelte';

	import { getContext, onMount } from 'svelte';
	import type { ColumnCell, Pagination, ReportDto, RowCell } from '$lib/types';
	import {
		delay,
		friendlyDateString,
		fromPaginationToQuery,
		removeItemById
	} from '$lib/utils/functions';

	import { generateMessages } from '$components/toast.svelte';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { UserStore } from '$src/lib/store/user';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.reports.list;
	$: sharedI18n = $LL.shared;

	export let data: PageData;

	let reportData: ReportDto[] = [];
	let userStore = getContext<UserStore>('userStore');
	let totalCount = 1;
	let totalPages = 1;
	let isReady = false;

	let isLoading = true;
	let messages: any[] = [];
	let itemsSelected: string[] = [];

	let showModal = false;
	let modal = {
		title: '',
		text: ''
	};

	onMount(async () => {
		const accessToken = userStore.get('accessToken');
		axios.setAuth(accessToken);
		isReady = true;

		if (userStore.isVolunteer() || userStore.isAdmin()) {
			pagination.searchSpecificField = 'fieldId';
			pagination.searchSpecificValue = userStore.get('user.fieldId');
		}

		await loadNamespaceAsync(data.locale, 'reports');
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

			const res = await axios.get(`report?${queryString}`);
			reportData = res.data.data;
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
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText(),
		buttonLink: `/${data.locale}/reports/add`
	};

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.titleLabel(),
			key: 'title'
		},
		{
			label: i18n.collectionHeader.textLabel(),
			key: 'text'
		},
		{
			label: i18n.collectionHeader.shortDescriptionLabel(),
			key: 'shortDescription'
		},
		{
			label: i18n.collectionHeader.attachmentsLabel(),
			key: 'attachments'
		},
		{
			label: i18n.collectionHeader.monthLabel(),
			key: 'month'
		},
		{
			label: i18n.collectionHeader.yearLabel(),
			key: 'year'
		},
		{
			label: i18n.collectionHeader.typeLabel(),
			key: 'type'
		},
		{
			label: sharedI18n.collectionHeader.createdAtLabel(),
			key: 'createdAt'
		},
		{
			label: sharedI18n.collectionHeader.updatedAtLabel(),
			key: 'updatedAt'
		},
		{
			label: sharedI18n.collectionHeader.deletedLabel(),
			key: 'deleted'
		}
	] as ColumnCell[];

	$: collectionData = Object.entries(reportData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.titleLabel(),
					key: 'title',
					value: item.title
				},
				{
					label: i18n.collectionHeader.textLabel(),
					key: 'text',
					value: item.text,
					textLimit: 100,
					isModal: true
				},
				{
					label: i18n.collectionHeader.shortDescriptionLabel(),
					key: 'shortDescription',
					value: item.shortDescription,
					textLimit: 100,
					isModal: true
				},
				{
					label: i18n.collectionHeader.attachmentsLabel(),
					key: 'attachments',
					value: item.attachments,
					isJson: true
				},
				{
					label: i18n.collectionHeader.monthLabel(),
					key: 'month',
					value: item.month
				},
				{
					label: i18n.collectionHeader.yearLabel(),
					key: 'year',
					value: item.year
				},
				{
					label: i18n.collectionHeader.typeLabel(),
					key: 'type',
					value: item.type,
					isTag: true
				},
				{
					label: sharedI18n.collectionHeader.createdAtLabel(),
					key: 'createdAt',
					value: item.createdAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: sharedI18n.collectionHeader.updatedAtLabel(),
					key: 'updatedAt',
					value: item.updatedAt,
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

	// On Event Functions
	function handleEdit(event: CustomEvent) {
		const id = event.detail;
		goto(`/${data.locale}/reports/edit?id=${id}`);
	}

	async function handleRemove(event: CustomEvent) {
		const { id, data } = event.detail;
		const remove = confirm(sharedI18n.remove.report({ title: data.title }));

		if (remove) {
			isLoading = true;
			try {
				await axios.delete(`/report/${id}`);
				reportData = removeItemById(id, reportData);
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

	function onModalOpen(event: CustomEvent) {
		const {
			data,
			key
		}: { data: ReportDto; key: keyof Pick<ReportDto, 'text' | 'shortDescription'> } = event.detail;
		modal.title =
			key == 'text'
				? i18n.collectionHeader.textLabel()
				: i18n.collectionHeader.shortDescriptionLabel();
		modal.text = data[key] ?? '';
		showModal = true;
	}

	function onCloseModal() {
		showModal = false;
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
		baseRoute={'/report'}
		locale={data.locale}
		on:refresh={loadData}
		on:restore={loadData}
		on:remove={loadData}
		on:searchLoad={onSearchLoad}
		on:searchClear={onSearchClear}
		bind:search={searchInput}
		bind:page={pagination.page}
		bind:showDeleted={pagination.deleted}
		bind:searchSpecificField={pagination.searchSpecificField}
		bind:searchSpecificValue={pagination.searchSpecificValue}
		bind:messages
		bind:itemsSelected
		bind:isLoading
	>
		<CollectionHeader
			columns={collectionHeader}
			locale={data.locale}
			on:click={onSort}
			bind:showDeleted={pagination.deleted}
		/>
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow
				rowCells={row}
				locale={data.locale}
				on:modalopen={onModalOpen}
				on:edit={handleEdit}
				on:remove={handleRemove}
				on:select={handleSelect}
				bind:showDeleted={pagination.deleted}
			/>
		{/each}
		{#if collectionData.length === 0 && !isLoading}
			<CollectionRowPlaceholder
				locale={data.locale}
				buttonLink={appHeader.buttonLink}
				buttonText={appHeader.buttonText}
			/>
		{/if}
	</AppContent>
	{#if showModal}
		<Modal show={true} on:close={onCloseModal}>
			<h2 slot="header">{modal.title}</h2>
			<p>{modal.text}</p>
		</Modal>
	{/if}
</AppContainer>
