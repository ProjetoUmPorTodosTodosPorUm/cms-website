<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';
	import CollectionRowPlaceholder from '$components/collection-row-placeholder.svelte';

	import { getContext, onMount } from 'svelte';
	import type { ColumnCell, MonthlyOfferDto, Pagination, RowCell } from '$lib/types';
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
	import type { SettingsStore } from '$src/lib/store/settings';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['collected-offers'].list;
	$: sharedI18n = $LL.shared;

	export let data: PageData;

	let monthlyFamilyData: MonthlyOfferDto[] = [];
	let userStore = getContext<UserStore>('userStore');
	let settingsStore = getContext<SettingsStore>('settingsStore');
	let totalCount = 1;
	let totalPages = 1;
	let isReady = false;

	$: Currency = Intl.NumberFormat(data.locale, {
		style: 'currency',
		currency: settingsStore.get('currency')
	});

	let isLoading = true;
	let messages: any[] = [];
	let itemsSelected: string[] = [];

	onMount(async () => {
		const accessToken = userStore.get('accessToken');
		axios.setAuth(accessToken);
		isReady = true;

		if (userStore.isVolunteer() || userStore.isAdmin()) {
			pagination.searchSpecificField = 'fieldId';
			pagination.searchSpecificValue = userStore.get('user.fieldId');
		}

		await loadNamespaceAsync(data.locale, 'collected-offers');
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
	let searchMinLength = 1;
	let searchType: 'text' | 'number' = 'number';

	$: queryString = fromPaginationToQuery(pagination);
	$: queryString, loadData();

	async function loadData() {
		while (!isReady) {
			await delay(50);
		}

		try {
			isLoading = true;

			const res = await axios.get(`monthly-offer?${queryString}`);
			monthlyFamilyData = res.data.data;
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
		buttonLink: `/${data.locale}/collected-offers/add`
	};

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.monthLabel(),
			key: 'month'
		},
		{
			label: i18n.collectionHeader.yearLabel(),
			key: 'year'
		},
		{
			label: i18n.collectionHeader.foodQntLabel(),
			key: 'foodQnt'
		},
		{
			label: i18n.collectionHeader.monetaryValueLabel(),
			key: 'monetaryValue'
		},
		{
			label: i18n.collectionHeader.othersQntLabel(),
			key: 'othersQnt'
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

	$: collectionData = Object.entries(monthlyFamilyData).map(
		([key, data]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: data.id
				},
				{
					label: i18n.collectionHeader.monthLabel(),
					key: 'month',
					value: data.month
				},
				{
					label: i18n.collectionHeader.yearLabel(),
					key: 'year',
					value: data.year
				},
				{
					label: i18n.collectionHeader.foodQntLabel(),
					key: 'foodQnt',
					value: data.foodQnt
				},
				{
					label: i18n.collectionHeader.monetaryValueLabel(),
					key: 'monetaryValue',
					value: data.monetaryValue,
					transform: (val: number) => Currency.format(val)
				},
				{
					label: i18n.collectionHeader.othersQntLabel(),
					key: 'othersQnt',
					value: data.othersQnt
				},
				{
					label: sharedI18n.collectionHeader.createdAtLabel(),
					key: 'createdAt',
					value: data.createdAt,
					transform: friendlyDateString
				},
				{
					label: sharedI18n.collectionHeader.updatedAtLabel(),
					key: 'updatedAt',
					value: data.updatedAt,
					transform: friendlyDateString
				},
				{
					label: sharedI18n.collectionHeader.deletedLabel(),
					key: 'deleted',
					value: data.deleted,
					transform: friendlyDateString
				}
			] as RowCell[]
	);

	// On Event Functions
	function handleEdit(event: CustomEvent) {
		const id = event.detail;
		goto(`/${data.locale}/collected-offers/edit?id=${id}`);
	}

	async function handleRemove(event: CustomEvent) {
		const { id, data }: { id: string; data: MonthlyOfferDto } = event.detail;
		const remove = confirm(
			sharedI18n.remove.collectedOffer({
				month: data.month,
				year: data.year
			})
		);

		if (remove) {
			isLoading = true;
			try {
				await axios.delete(`/monthly-offer/${id}`);
				monthlyFamilyData = removeItemById(id, monthlyFamilyData);
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
		baseRoute={'/monthly-offer'}
		locale={data.locale}
		{searchMinLength}
		{searchType}
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
			locale={data.locale}
			on:click={onSort}
			bind:showDeleted={pagination.deleted}
		/>
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow
				rowCells={row}
				locale={data.locale}
				on:edit={handleEdit}
				on:remove={handleRemove}
				on:select={handleSelect}
				bind:showDeleted={pagination.deleted}
			/>
		{/each}
		{#if collectionData.length === 0}
			<CollectionRowPlaceholder
				buttonLink={appHeader.buttonLink}
				buttonText={appHeader.buttonText}
			/>
		{/if}
	</AppContent>
</AppContainer>
