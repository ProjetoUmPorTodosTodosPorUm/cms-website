<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';
	import CollectionRowPlaceholder from '$components/collection-row-placeholder.svelte';
	import Modal from '$components/modal.svelte';

	import { getContext, onMount } from 'svelte';
	import type { ChurchDto, ColumnCell, Pagination, RowCell } from '$lib/types';
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

	let churchData: ChurchDto[] = [];
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

			const res = await axios.get(`church?${queryString}`);
			churchData = res.data.data;
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
		name: 'Igrejas',
		buttonText: 'Adicionar Igreja Em Unidade',
		buttonLink: `/${data.locale}/churches/add`
	};

	// Collection Header
	const collectionHeader = [
		{
			label: 'Nome',
			key: 'name'
		},
		{
			label: 'Descrição',
			key: 'description'
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

	$: collectionData = Object.entries(churchData).map(
		([key, data]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: data.id
				},
				{
					label: 'Nome',
					key: 'name',
					value: data.name
				},
				{
					label: 'Descrição',
					key: 'description',
					value: data.description,
					textLimit: 100,
					isModal: true
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
		goto(`/${data.locale}/churches/edit?id=${id}`);
	}

	async function handleRemove(event: CustomEvent) {
		const { id, data }: { id: string; data: ChurchDto } = event.detail;
		const remove = confirm(TEMPLATES.REMOVE.CHURCH(data.name));

		if (remove) {
			isLoading = true;
			try {
				await axios.delete(`/church/${id}`);
				churchData = removeItemById(id, churchData);
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
		const { data, key }: { data: ChurchDto; key: keyof Pick<ChurchDto, 'description'> } =
			event.detail;
		modal.title = data.name;
		modal.text = data[key] ?? '';
		showModal = true;
	}

	function onCloseModal() {
		showModal = false;
	}
</script>

<svelte:head>
	<title>Churches</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/church'}
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
