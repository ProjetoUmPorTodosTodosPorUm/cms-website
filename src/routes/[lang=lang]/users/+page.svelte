<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import CollectionHeader from '$components/collection-header.svelte';
	import CollectionRow from '$components/collection-row.svelte';
	import CollectionRowPlaceholder from '$components/collection-row-placeholder.svelte';

	import { getContext, onMount } from 'svelte';
	import type { Pagination, RowCell, UserDto } from '$lib/types';
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

	let userData: UserDto[] = [];
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

		if(userStore.isVolunteer() || userStore.isAdmin()) {
			pagination.searchSpecificField = 'fieldId';
			pagination.searchSpecificValue = userStore.get('user.fieldId')
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

			const res = await axios.get(`user?${queryString}`);
			userData = res.data.data;
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
		name: 'Usuários',
		buttonText: 'Adicionar Usuário',
		buttonLink: `/${data.locale}/users/add`
	};

	// Collection Header
	const collectionHeader = [
		{
			label: 'Primeiro Nome',
			key: 'firstName'
		},
		{
			label: 'Último Nome',
			key: 'lastName'
		},
		{
			label: 'Email',
			key: 'email'
		},
		{
			label: 'Acesso',
			key: 'role'
		},
		{
			label: 'Último Acesso',
			key: 'lastAccess'
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
	];

	$: collectionData = Object.entries(userData).map(
		([key, user]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: user.id
				},
				{
					label: 'Primeiro Nome',
					key: 'firstName',
					value: user.firstName
				},
				{
					label: 'Último Nome',
					key: 'lastName',
					value: user.lastName ?? '(não informado)'
				},
				{
					label: 'Email',
					key: 'email',
					value: user.email
				},
				{
					label: 'Acesso',
					key: 'role',
					value: user.role,
					isTag: true
				},
				{
					label: 'Último Acesso',
					key: 'lastAccess',
					value: user.lastAccess,
					transform: friendlyDateString
				},
				{
					label: 'Criado Em',
					key: 'createdAt',
					value: user.createdAt,
					transform: friendlyDateString
				},
				{
					label: 'Atualizado Em',
					key: 'updatedAt',
					value: user.updatedAt,
					transform: friendlyDateString
				},
				{
					label: 'Deletado Em',
					key: 'deleted',
					value: user.deleted,
					transform: friendlyDateString
				}
			] as RowCell[]
	);

	// On Event Functions
	function handleEdit(event: CustomEvent) {
		const id = event.detail;
		goto(`/${data.locale}/users/edit?id=${id}`);
	}

	async function handleRemove(event: CustomEvent) {
		const { id, data } = event.detail;
		const remove = confirm(TEMPLATES.REMOVE.USER(data.email));

		if (remove) {
			isLoading = true;
			try {
				await axios.delete(`/user/${id}`);
				userData = removeItemById(id, userData);
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
	<title>Users</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		baseRoute={'/user'}
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
