<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
	import HiOutlineCamera from 'svelte-icons-pack/hi/HiOutlineCamera';
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX';

	import { getContext, onMount } from 'svelte';

	import { CHURCH_TEMPLATE, TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { ChurchType } from '$src/lib/enums';

	export let data: PageData;

	let isLoading = true;
	let churchData = CHURCH_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Igreja',
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
	const churchTypes = [
		{ value: 'PIONEER', text: 'Pioneira' },
		{ value: 'EXPANSION', text: 'Expansionista' },
		{ value: 'SUPPORT', text: 'Apoio' },
		{ value: 'RESPONSIBLE', text: 'Responsável' }
	];

	const schema = yup.object().shape({
		name: yup.string().required(TEMPLATES.YUP.REQUIRED('Nome')),
		description: yup.string().required(TEMPLATES.YUP.REQUIRED('Descrição')),
		images: yup.array(yup.string()).nullable().optional(),
		type: yup
			.string()
			.oneOf(Object.values(ChurchType), TEMPLATES.YUP.ONE_OF(churchTypes.map((r) => r.text)))
			.required(TEMPLATES.YUP.REQUIRED('Tipo')),
		field: yup.string().nullable().optional()
	});

	let filesToUpload: File[] | null;
	let filesToRemove: string[] = [];

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
			churchData = (await axios.get(`/church/${id}`)).data.data;
			churchData.field = churchData.fieldId;
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
					name: churchData.name,
					description: churchData.description,
					images: churchData.images,
					type: churchData.type,
					field: churchData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (filesToUpload) {
					await uploadFiles(filesToUpload);
				}

				const postData = {
					name: churchData.name,
					description: churchData.description,
					images: churchData.images,
					type: churchData.type,
					field: churchData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/church/${churchData.id}`, postData);

				if (filesToRemove.length > 0) {
					await removeFiles(filesToRemove);
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
		const files = (event.target as any).files as File[];
		if (files.length > 0) {
			filesToUpload = files;
		} else {
			filesToUpload = null;
		}
	}

	async function uploadFiles(files: File[]) {
		try {
			let formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}

			const res = await axios.post('/file/bulk', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			churchData.images = [
				...churchData.images,
				...(res.data.data as FileDto[]).map((file) => file.name)
			];
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				throw new Axios.AxiosError('Os arquivos são muito grandes!');
			} else {
				console.warn(error);
			}
		}
	}

	async function removeFiles(filesToRemove: string[]) {
		try {
			await axios.delete('/file/bulk', {
				data: {
					files: filesToRemove
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

	function onRemoveFile(index: number) {
		const remove = confirm(TEMPLATES.REMOVE.FILE(churchData.images[index]));

		if (remove) {
			filesToRemove = churchData.images.splice(index, 1);
			churchData.images = churchData.images;
		}
	}
</script>

<svelte:head>
	<title>Churches</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={churchData.name}
					name="name"
					placeholder="Nome"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={churchData.description}
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
				{#if churchData.images.length > 0}
					<div class="files">
						{#each churchData.images as attachment, index}
							<div class="item">
								<a href={`/static/${attachment}`}>{attachment}</a>
								<button class="btn-close" on:click|preventDefault={() => onRemoveFile(index)}
									><Icon src={HiOutlineX} /></button
								>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={churchData.type} name="type" required>
					<option value={null} disabled selected>Tipo</option>

					{#each churchTypes as churchType}
						<option value={churchType.value}>{churchType.text}</option>
					{/each}
				</select>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={churchData.field} name="field" required>
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
