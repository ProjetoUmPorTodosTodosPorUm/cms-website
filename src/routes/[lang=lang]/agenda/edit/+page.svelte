<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone';
	import HiOutlineDocument from 'svelte-icons-pack/hi/HiOutlineDocument';
	import HiOutlinePaperClip from 'svelte-icons-pack/hi/HiOutlinePaperClip';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX';

	import { getContext, onMount } from 'svelte';

	import { AGENDA_TEMPLATE, TEMPLATES } from '$src/lib/constants';
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
	let agendaData = AGENDA_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Evento',
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
	let formRef: HTMLFormElement;
	let fields: FieldDto[] = [];

	const schema = yup.object().shape({
		title: yup.string().required(TEMPLATES.YUP.REQUIRED('Título')),
		message: yup.string().required(TEMPLATES.YUP.REQUIRED('Mensagem')),
		attachments: yup.array(yup.string()).nullable().optional(),
		date: yup.string().required(TEMPLATES.YUP.REQUIRED('Data')),
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
			agendaData = (await axios.get(`/agenda/${id}`)).data.data;
			agendaData.date = agendaData.date.split('T')[0];
			agendaData.field = agendaData.fieldId;
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
					title: agendaData.title,
					message: agendaData.message,
					attachments: agendaData.attachments,
					date: agendaData.date,
					field: agendaData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (filesToUpload) {
					await uploadFiles(filesToUpload);
				}

				const postData = {
					title: agendaData.title,
					message: agendaData.message,
					attachments: agendaData.attachments ?? [],
					date: agendaData.date,
					field: agendaData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/agenda/${agendaData.id}`, postData);

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
			agendaData.attachments = [
				...agendaData.attachments,
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

	function onRemoveAttachment(index: number) {
		const remove = confirm(TEMPLATES.REMOVE.FILE(agendaData.attachments[index]));

		if (remove) {
			filesToRemove = agendaData.attachments.splice(index, 1);
			agendaData.attachments = agendaData.attachments;
		}
	}
</script>

<svelte:head>
	<title>Agenda</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input
					bind:value={agendaData.title}
					name="title"
					placeholder="Título"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineDocument} />
				<textarea
					bind:value={agendaData.message}
					name="message"
					placeholder="Mensagem"
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlinePaperClip} />
				<input on:change={onFileInputChange} name="attachments" multiple type="file" />
				{#if agendaData.attachments.length > 0}
					<div class="files">
						{#each agendaData.attachments as attachment, index}
							<div class="item">
								<a href={`/static/${attachment}`}>{attachment}</a>
								<button class="btn-close" on:click|preventDefault={() => onRemoveAttachment(index)}
									><Icon src={HiOutlineX} /></button
								>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input bind:value={agendaData.date} name="email" type="date" autocomplete="off" required />
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={agendaData.field} name="field" required>
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
