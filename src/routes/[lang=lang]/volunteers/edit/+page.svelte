<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag';
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';

	import { MESSAGES, TEMPLATES, VOLUNTEER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { Occupation } from '$src/lib/enums';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	export let data: PageData;

	let isLoading = true;
	let volunteerData = VOLUNTEER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Voluntário',
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

	const defaultAvatarSrc = '/images/fallback-avatar.webp';
	const occupations = [
		{ value: 'PRESIDENT', text: 'Presidente' },
		{ value: 'VICE_PRESIDENT', text: 'Vice-Presidente' },
		{ value: 'GENERAL_COORDINATOR', text: 'Coodenador Geral' },
		{ value: 'COORDINATOR_01', text: 'Coordenador 01' },
		{ value: 'COUNSELOR_01', text: 'Conselheiro 01' },
		{ value: 'COUNSELOR_02', text: 'Conselheiro 02' },
		{ value: 'COUNSELOR_03', text: 'Conselheiro 03' },
		{ value: 'WEB_MASTER', text: 'Web Master' },
		{ value: 'TREASURER_01', text: 'Tesoureiro 01' },
		{ value: 'TREASURER_02', text: 'Tesoureiro 02' },
		{ value: 'ACADEMIC_INSTRUCTOR_01', text: 'Instrutor Acadêmico 01' },
		{ value: 'ACADEMIC_INSTRUCTOR_02', text: 'Instrutor Acadêmico 02' },
		{ value: 'EXECUTIVE_SECRETARY', text: 'Secretária Executivo' },
		{ value: 'AUXILIARY_SECRETARY', text: 'Secretária Auxiliar' },
		{ value: 'COORDINATOR_02', text: 'Coodenador 02' },
		{ value: 'INFIELD_COORDINATOR', text: 'Coordenador Interno' },
		{ value: 'OUTFIELD_COORDINATOR', text: 'Coordenador Externo' },
		{ value: 'COLLECTOR', text: 'Coletor' },
		{ value: 'SUPPORT_SERVICE', text: 'Serviço de Apoio' }
	];

	const schema = yup.object().shape({
		firstName: yup.string().required(TEMPLATES.YUP.REQUIRED('Primeiro Nome')),
		lastName: yup.string().nullable().optional(),
		email: yup.string().email(MESSAGES.YUP.EMAIL).nullable().optional(),
		avatar: yup.string().nullable().optional(),
		joinedDate: yup.string().required(TEMPLATES.YUP.REQUIRED('Data de Admissão')),
		occupation: yup
			.string()
			.oneOf(Object.values(Occupation), TEMPLATES.YUP.ONE_OF(occupations.map((r) => r.text)))
			.required(TEMPLATES.YUP.REQUIRED('Ocupação')),
		church: yup.string().nullable().optional(),
		priest: yup.string().nullable().optional(),
		observation: yup.string().nullable().optional(),
		field: yup.string().nullable().optional()
	});

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
		avatarImageRef.src = defaultAvatarSrc;
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');
		const id = navigation.to?.url.searchParams.get('id');

		if (id && idMatcher(id) && accessToken) {
			axios.setAuth(accessToken);
			volunteerData = (await axios.get(`/volunteer/${id}`)).data.data;
			volunteerData.joinedDate = volunteerData.joinedDate.split('T')[0];
			volunteerData.field = volunteerData.fieldId;
			avatarImageRef.src = volunteerData.avatar
				? `${PUBLIC_STATIC_PATH}/${volunteerData.avatar}`
				: defaultAvatarSrc;
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
					firstName: volunteerData.firstName,
					lastName: volunteerData.lastName,
					email: volunteerData.email,
					avatar: volunteerData.avatar,
					joinedDate: volunteerData.joinedDate,
					occupation: volunteerData.occupation,
					church: volunteerData.church,
					priest: volunteerData.priest,
					observation: volunteerData.observation,
					field: volunteerData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (avatarToUpload) {
					await uploadFile(avatarToUpload);
				}

				const postData = {
					firstName: volunteerData.firstName,
					lastName: volunteerData.lastName,
					email: volunteerData.email,
					avatar: volunteerData.avatar,
					joinedDate: volunteerData.joinedDate,
					occupation: volunteerData.occupation,
					church: volunteerData.church,
					priest: volunteerData.priest,
					observation: volunteerData.observation,
					field: volunteerData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/volunteer/${volunteerData.id}`, postData);

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

	function onAvatarInput(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		avatarInputRef.click();
	}

	function onAvatarChange(event: Event) {
		const file = (event.target as any).files[0] as File;
		if (file) {
			avatarToUpload = file;
			avatarImageRef.src = URL.createObjectURL(file);
		} else {
			avatarToUpload = null;
			avatarImageRef.src = defaultAvatarSrc;
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
			volunteerData.avatar = res.data.data.name;
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
	<title>Volunteers</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="image-preview">
				<img bind:this={avatarImageRef} src="" alt="Imagem de perfil" />
				<div class="overlay">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#" on:click={onAvatarInput}>Editar</a>
					<input
						bind:this={avatarInputRef}
						on:change={onAvatarChange}
						name="avatar"
						type="file"
						accept=".jpg,.jpeg,.png"
					/>
				</div>
			</div>

			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.firstName}
					name="firstName"
					type="text"
					placeholder="Primeiro Nome"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.lastName}
					name="lastName"
					type="text"
					placeholder="Sobrenome"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					bind:value={volunteerData.email}
					name="email"
					type="email"
					placeholder="Email"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input
					bind:value={volunteerData.joinedDate}
					name="joinedDate"
					type="date"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={volunteerData.occupation} name="occupation" required>
					<option value={null} disabled selected>Ocupação</option>

					{#each occupations as occupation}
						<option value={occupation.value}>{occupation.text}</option>
					{/each}
				</select>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={volunteerData.church}
					name="church"
					type="text"
					placeholder="Igreja"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.priest}
					name="priest"
					type="text"
					placeholder="Pastor"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={volunteerData.observation}
					name="observation"
					placeholder="Observação"
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={volunteerData.field} name="field" required>
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
