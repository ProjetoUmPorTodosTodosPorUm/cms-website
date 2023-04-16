<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
	import HiOutlineCamera from 'svelte-icons-pack/hi/HiOutlineCamera';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX';

	import { getContext, onMount } from 'svelte';

	import { COLLABORATOR_TEMPLATE, TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';

	export let data: PageData;

	let isLoading = true;
	let collaboratorData = COLLABORATOR_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Colaborador',
		buttonText: 'Salvar'
	};

	const query = {
		itemsPerPage: 100,
		page: 1,
		deleted: false,
		orderKey: 'designation',
		orderValue: 'asc'
	} as Pagination;
	$: queryString = fromPaginationToQuery(query);

	// Form
	let fields: FieldDto[] = [];

	const schema = yup.object().shape({
		title: yup.string().required(TEMPLATES.YUP.REQUIRED('Título')),
		description: yup.string().required(TEMPLATES.YUP.REQUIRED('Descrição')),
		image: yup.string().nullable().optional(),
		field: yup.string().nullable().optional()
	});

	let fileToUpload: File | null;
	let fileToRemove: string;

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');
		const id = navigation.to?.url.searchParams.get('id');

		if (id && idMatcher(id) && accessToken) {
			axios.setAuth(accessToken);
			collaboratorData = (await axios.get(`/collaborator/${id}`)).data.data;
			collaboratorData.field = collaboratorData.fieldId;
		}
		isLoading = false;
	});

	async function loadData() {
		try {
			isLoading = true;
			fields = (await axios.get(`/field?${queryString}`)).data.data;
			isLoading = false;
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isLoading = true;

		try {
			const isValid = schema.validateSync(
				{
					title: collaboratorData.title,
					description: collaboratorData.description,
					image: collaboratorData.image,
					field: collaboratorData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (fileToUpload) {
					await uploadFile(fileToUpload);
				}

				const postData = {
					title: collaboratorData.title,
					description: collaboratorData.description,
					image: collaboratorData.image,
					field: collaboratorData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/collaborator/${collaboratorData.id}`, postData);

				if (fileToRemove) {
					await removeFile(fileToRemove);
				}

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			}
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message ?? error.message }]);
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	function onFileInputChange(event: Event) {
		const file = (event.target as any).files[0] as File;
		if (file) {
			fileToUpload = file;

			if(collaboratorData.image) {
				fileToRemove = collaboratorData.image;
			}
		} else {
			fileToUpload = null;
		}
	}

	async function uploadFile(file: File) {
		try {
			let formData = new FormData();
			formData.append('file', file);
			const res = await axios.post('/file', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			collaboratorData.image = res.data.data.name;
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				throw new Axios.AxiosError('O arquivo é muito grande!');
			} else {
				console.warn(error);
			}
		}
	}

	async function removeFile(fileToRemove: string) {
		try {
			await axios.delete('/file/bulk', {
				data: {
					files: [fileToRemove]
				}
			});
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message ?? error.message }]);
			} else {
				console.warn(error);
			}
		}
	}

	function onRemoveFile() {
		const remove = confirm(TEMPLATES.REMOVE.FILE(collaboratorData.image));

		if (remove) {
			fileToRemove = collaboratorData.image
			collaboratorData.image = '';
		}
	}
</script>

<svelte:head>
	<title>Collaborators</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<input
					bind:value={collaboratorData.title}
					name="title"
					placeholder="Título"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={collaboratorData.description}
					name="description"
					placeholder="Descrição"
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCamera} />
				<input on:change={onFileInputChange} name="images" multiple type="file" />
				{#if collaboratorData.image}
					<div class="files">
						<div class="item">
							<a href={`/static/${collaboratorData.image}`}>{collaboratorData.image}</a>
							<button
								class="btn-close"
								on:click|preventDefault={() => onRemoveFile()}
								><Icon src={HiOutlineX} /></button
							>
						</div>
					</div>
				{/if}
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={collaboratorData.field} name="field" required>
						<option value={null} disabled selected>Campo Missionário</option>

						{#each fields as field}
							<option value={field.id}>
								{field.abbreviation} - {field.designation}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		</form>
	</AppContent>
</AppContainer>
