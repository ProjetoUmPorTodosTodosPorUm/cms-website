<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from "svelte-icons-pack/hi/HiOutlineUser";
	import HiOutlineIdentification from "svelte-icons-pack/hi/HiOutlineIdentification";

	import { getContext, onMount } from 'svelte';
	import { Role } from '$lib/enums';

	import { TEMPLATES, USER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { idMatcher } from '$src/lib/utils/functions';
	import type { PageData } from './$types';
	import type { UserStore } from '$src/lib/store/user';

	export let data: PageData;

	let isLoading = true;
	let userData = USER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Usuário',
		buttonText: 'Salvar'
	};

	// Form
	let formRef: HTMLFormElement;
	const defaultAvatarSrc = '/images/fallback-avatar.webp';
	const roles = [
		{ value: 'VOLUNTEER', text: 'Voluntário' },
		{ value: 'ADMIN', text: 'Admin' },
		{ value: 'WEB_MASTER', text: 'Web Master' }
	];
	const schema = yup.object().shape({
		firstName: yup.string().required(TEMPLATES.YUP.REQUIRED('Nome')),
		lastName: yup.string().optional(),
		role: yup
			.string()
			.oneOf(Object.values(Role), TEMPLATES.YUP.ONE_OF(roles.map((r) => r.text)))
			.required(TEMPLATES.YUP.REQUIRED('Acesso')),
		avatar: yup.string().optional()
	});

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;

	let messages: any[] = [];

	onMount(() => {
		avatarImageRef.src = defaultAvatarSrc;
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');
		const id = navigation.to?.url.searchParams.get('id');

		if (id && idMatcher(id) && accessToken) {
			axios.setAuth(accessToken);
			userData = (await axios.get(`/user/${id}`)).data.data;
			avatarImageRef.src = userData.avatar
				? `${PUBLIC_STATIC_PATH}/${userData.avatar}`
				: defaultAvatarSrc;
		}
		isLoading = false;
	});

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isLoading = true;

		try {
			const isValid = schema.validateSync(
				{
					firstName: userData.firstName,
					lastName: userData.lastName,
					role: userData.role,
					avatar: userData.avatar ?? undefined
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (avatarToUpload) {
					await uploadFile(avatarToUpload);
				}

				const res = await axios.put(`/user/${userData.id}`, {
					firstName: userData.firstName,
					lastName: userData.lastName,
					role: userData.role,
					avatar: userData.avatar ?? undefined
				});

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
			userData.avatar = res.data.data.name;
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
	<title>Users</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
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
					bind:value={userData.firstName}
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
					bind:value={userData.lastName}
					name="lastName"
					type="text"
					placeholder="Sobrenome"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<select bind:value={userData.role} name="role" required>
					<option value="" disabled selected>Acesso</option>
					{#each roles as role}
						<option value={role.value}>
							{role.text}
						</option>
					{/each}
				</select>
			</div>
		</form>
	</AppContent>
</AppContainer>
