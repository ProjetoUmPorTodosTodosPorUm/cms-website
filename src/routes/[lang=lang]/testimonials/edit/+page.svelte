<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineChatAlt from 'svelte-icons-pack/hi/HiOutlineChatAlt';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';

	import { TEMPLATES, TESTIMONIAL_TEMPLATE } from '$src/lib/constants';
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
	let testimonialData = TESTIMONIAL_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = false;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Testemunho',
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
		name: yup.string().required(TEMPLATES.YUP.REQUIRED('Nome')),
		email: yup.string().email().required(TEMPLATES.YUP.REQUIRED('E-mail')),
		text: yup.string().required(TEMPLATES.YUP.REQUIRED('Texto')),
		field: yup.string().nullable().optional()
	});

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
			testimonialData = (await axios.get(`/testimonial/${id}`)).data.data;
			testimonialData.field = testimonialData.fieldId;
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
					name: testimonialData.name,
					email: testimonialData.email,
					text: testimonialData.text,
					field: testimonialData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				const postData = {
					name: testimonialData.name,
					email: testimonialData.email,
					text: testimonialData.text,
					field: testimonialData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/testimonial/${testimonialData.id}`, postData);

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
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
</script>

<svelte:head>
	<title>Testimonial</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={testimonialData.name}
					name="name"
					placeholder="Nome"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					bind:value={testimonialData.email}
					name="email"
					placeholder="E-mail"
					type="email"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineChatAlt} />
				<textarea
					bind:value={testimonialData.text}
					name="text"
					placeholder="Texto"
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineGlobe} />
				<select bind:value={testimonialData.field} name="field" required>
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
