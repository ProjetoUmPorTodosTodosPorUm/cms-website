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
	import { TEMPLATES } from '$src/lib/constants';
	import type { PageData } from './$types';
	import type { UserStore } from '$src/lib/store/user';

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
	const appHeader = {
		name: 'Relatórios',
		buttonText: 'Adicionar Relatório',
		buttonLink: `/${data.locale}/reports/add`
	};

	// Collection Header
	const collectionHeader = [
		{
			label: 'Título',
			key: 'title'
		},
		{
			label: 'Texto',
			key: 'text'
		},
		{
			label: 'Descrição Curta',
			key: 'shortDescription'
		},
		{
			label: 'Anexos',
			key: 'attachments'
		},
		{
			label: 'Mês',
			key: 'month'
		},
		{
			label: 'Ano',
			key: 'year'
		},
		{
			label: 'Tipo',
			key: 'type'
		},
		{
			label: 'Criado Em',
			key: 'createdAt'
		},
		{
			label: 'Atualizado Em',
			key: 'updatedAt'
		},
		{
			label: 'Deletado Em',
			key: 'deleted'
		}
	] as ColumnCell[];

	$: collectionData = Object.entries(reportData).map(
		([key, data]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: data.id
				},
				{
					label: 'Título',
					key: 'title',
					value: data.title
				},
				{
					label: 'Texto',
					key: 'text',
					value: data.text,
					textLimit: 100,
					isModal: true
				},
				{
					label: 'Descrição Curta',
					key: 'shortDescription',
					value: data.shortDescription,
					textLimit: 100,
					isModal: true
				},
				{
					label: 'Anexos',
					key: 'attachments',
					value: data.attachments,
					isJson: true
				},
				{
					label: 'Mês',
					key: 'month',
					value: data.month
				},
				{
					label: 'Ano',
					key: 'year',
					value: data.year
				},
				{
					label: 'Tipo',
					key: 'type',
					value: data.type,
					isTag: true
				},
				{
					label: 'Criado Em',
					key: 'createdAt',
					value: data.createdAt,
					transform: friendlyDateString
				},
				{
					label: 'Atualizado Em',
					key: 'updatedAt',
					value: data.updatedAt,
					transform: friendlyDateString
				},
				{
					label: 'Deletado Em',
					key: 'deleted',
					value: data.deleted,
					transform: friendlyDateString
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
		const remove = confirm(TEMPLATES.REMOVE.REPORT(data.title));

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
		const { data, key }: { data: ReportDto, key: keyof Pick<ReportDto, 'text' | 'shortDescription'> } = event.detail;
		modal.title = data.title;
		modal.text = data[key] ?? '';
		showModal = true;
	}

	function onCloseModal() {
		showModal = false;
	}
</script>

<svelte:head>
	<title>Report</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/report'}
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
				on:modalopen={onModalOpen}
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
	{#if showModal}
		<Modal show={true} on:close={onCloseModal}>
			<h2 slot="header">{modal.title}</h2>
			<p>{modal.text}</p>
		</Modal>
	{/if}
</AppContainer>
