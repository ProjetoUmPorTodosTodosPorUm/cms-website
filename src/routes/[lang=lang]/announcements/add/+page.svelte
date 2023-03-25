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
	import BsPinAngle from 'svelte-icons-pack/bs/BsPinAngle';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';

	import { TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = false;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Adicionar Anúncio',
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
	let isLoading = false;
	let fields: FieldDto[] = [];

	const schema = yup.object().shape({
		title: yup.string().required(TEMPLATES.YUP.REQUIRED('Título')),
		message: yup.string().required(TEMPLATES.YUP.REQUIRED('Mensagem')),
		attachments: yup.array(yup.string()).nullable().optional(),
		fixed: yup.boolean().required(TEMPLATES.YUP.REQUIRED('Fixado')),
		field: yup.string().nullable().optional()
	});

	let fileInputRef: HTMLInputElement;
	let filesToUpload: File[] | null;

	let title: string;
	let message: string;
	let attachments: string[];
	let fixed = false;
	let field: string | null;

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
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
				{ title, message, attachments, fixed, field },
				{ abortEarly: false }
			);

			if (isValid) {
				if (filesToUpload) {
					await uploadFiles(filesToUpload);
				}

				const postData = {
					title,
					message,
					attachments,
					fixed,
					field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.post('/announcement', postData);

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
				eraseForm();
			}
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

	function eraseForm() {
		formRef.reset();
		field = null;
		fixed = false;
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
			attachments = (res.data.data as FileDto[]).map((file) => file.name);
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else {
				console.warn(error);
			}
		}
	}
</script>

<svelte:head>
	<title>Announcement</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input bind:value={title} name="title" placeholder="Título" autocomplete="off" required />
			</div>
			<div class="input">
				<Icon src={HiOutlineDocument} />
				<textarea
					bind:value={message}
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
			</div>
			<div class="input">
				<Icon src={BsPinAngle} />
				<div class="radio">
					<label for="#">Sim</label>
					<input bind:group={fixed} name="fixed" type="radio" value={true} />
				</div>
				<div class="radio">
					<label for="#">Não</label>
					<input bind:group={fixed} name="fixed" type="radio" value={false} />
				</div>
			</div>
			<div class="input">
				<Icon src={HiOutlineGlobe} />
				<select bind:value={field} name="field" required>
					<option value={null} disabled selected>Campo Missionário</option>

					{#each fields as field}
						<option value={field.id}>
							{field.abbreviation} - {field.designation}
						</option>
					{/each}
				</select>
			</div>
		</form>
	</AppContent>
</AppContainer>
