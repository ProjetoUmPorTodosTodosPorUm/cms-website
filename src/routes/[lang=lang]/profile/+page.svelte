<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed';
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification';

	import { getContext, onMount } from 'svelte';
	import { MESSAGES, TEMPLATES, USER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { translateFromEnum } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import type { PageData } from './$types';

	export let data: PageData;

	let isLoading = true;
	let userData = USER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');

	// App Container Options
	let showActions = false;
	let showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Perfil',
		buttonText: 'Salvar'
	};

	// Form
	let formRef: HTMLFormElement;
	const defaultAvatarSrc = '/images/fallback-avatar.webp';
	const roles = {
		USER: 'Usuário',
		ADMIN: 'Admin'
	};
	const schema = yup.object().shape({
		firstName: yup.string().required(TEMPLATES.YUP.REQUIRED('Nome')),
		lastName: yup.string().optional(),
		avatar: yup.string().optional(),
		password: yup.string().optional().min(8, TEMPLATES.YUP.MIN('Senha', 8)),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], MESSAGES.YUP.CONFIRM_PASSWORD)
			.nullable()
	});

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;

	let password: string;
	let confirmPassword: string;

	let messages: any[] = [];

	onMount(() => {
		avatarImageRef.src = defaultAvatarSrc;
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');

		if (accessToken) {
			axios.setAuth(accessToken);
			userData = (await axios.get(`/user/me`)).data.data;
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
					avatar: userData.avatar ?? undefined,
					password,
					confirmPassword
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (avatarToUpload) {
					await uploadFile(avatarToUpload);
				}

				const res = await axios.put(`/user/me`, {
					firstName: userData.firstName,
					lastName: userData.lastName,
					avatar: userData.avatar ?? undefined,
					password: password ?? undefined
				});

				userStore.updateUser(res.data.data);
				isLoading = false;
				erasePassword();
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

	function erasePassword() {
		password = '';
		confirmPassword = '';
	}
</script>

<svelte:head>
	<title>Profile</title>
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
				<Icon src={HiOutlineMail} />
				<input
					bind:value={userData.email}
					name="email"
					type="email"
					placeholder="Email"
					autocomplete="off"
					readonly
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLockClosed} />
				<input
					bind:value={password}
					name="password"
					type="password"
					minlength={8}
					placeholder="Senha"
					autocomplete="new-password"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLockClosed} />
				<input
					bind:value={confirmPassword}
					name="confirmPassword"
					type="password"
					minlength={8}
					placeholder="Confirme a Senha"
					autocomplete="new-password"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<input
					value={translateFromEnum(userData.role, roles)}
					name="role"
					placeholder="Papel"
					autocomplete="off"
					readonly
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
