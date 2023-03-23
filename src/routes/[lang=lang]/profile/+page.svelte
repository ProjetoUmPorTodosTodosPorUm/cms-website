<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import FiUser from 'svelte-icons-pack/fi/FiUser';
	import FiMail from 'svelte-icons-pack/fi/FiMail';
	import FiLock from 'svelte-icons-pack/fi/FiLock';
	import BiIdCard from 'svelte-icons-pack/bi/BiIdCard';

	import { onMount } from 'svelte';
	import { MESSAGES, TEMPLATES, USER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { getFromLocalStorage, translateFromEnum } from '$src/lib/utils/functions';
	import { UserStore } from '$src/lib/store/user';

	let isLoading = true;
	let data = USER_TEMPLATE;

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
		password: yup
			.string()
			.required(TEMPLATES.YUP.REQUIRED('Senha'))
			.min(8, TEMPLATES.YUP.MIN('Senha', 8)),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], MESSAGES.YUP.CONFIRM_PASSWORD)
			.required(TEMPLATES.YUP.REQUIRED('Confirmação da senha'))
	});

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;

	let userStore: UserStore;
	let password: string;
	let confirmPassword: string;

	let messages: any[] = [];

	onMount(() => {
		avatarImageRef.src = defaultAvatarSrc;
		userStore = new UserStore();
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = getFromLocalStorage('accessToken');

		if (accessToken) {
			axios.setAuth(accessToken);
			data = (await axios.get(`/user/me`)).data.data;
			avatarImageRef.src = data.avatar ? `${PUBLIC_STATIC_PATH}/${data.avatar}` : defaultAvatarSrc;
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
					firstName: data.firstName,
					lastName: data.lastName,
					avatar: data.avatar ?? undefined,
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
					firstName: data.firstName,
					lastName: data.lastName,
					avatar: data.avatar ?? undefined,
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
			data.avatar = res.data.data.name;
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
	<title>Dashboard | Perfil</title>
</svelte:head>

<AppContainer {messages}>
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
				<Icon src={FiUser} />
				<input
					bind:value={data.firstName}
					name="firstName"
					type="text"
					placeholder="Primeiro Nome"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<input
					bind:value={data.lastName}
					name="lastName"
					type="text"
					placeholder="Sobrenome"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={FiMail} />
				<input
					bind:value={data.email}
					name="email"
					type="email"
					placeholder="Email"
					autocomplete="off"
					readonly
				/>
			</div>
			<div class="input">
				<Icon src={FiLock} />
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
				<Icon src={FiLock} />
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
				<Icon src={BiIdCard} />
				<input
					value={translateFromEnum(data.role, roles)}
					name="role"
					placeholder="Papel"
					autocomplete="off"
					readonly
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
