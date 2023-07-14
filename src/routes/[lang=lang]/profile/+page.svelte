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
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus';

	import { getContext, onMount } from 'svelte';
	import { USER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { translateFromEnum } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import type { PageData } from './$types';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.profile;
	$: sharedI18n = $LL.shared;

	export let data: PageData;

	let isLoading = true;
	let userData = USER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');

	// App Container Options
	let showActions = false;
	let showRefreshButton = false;

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: ''
	};

	// Form
	let formRef: HTMLFormElement;
	const defaultAvatarSrc = '/images/fallback-avatar.webp';
	$: roles = {
		VOLUNTEER: i18n.roles.volunteer(),
		ADMIN: i18n.roles.admin(),
		WEB_MASTER: i18n.roles.webMaster()
	};

	$: schema = yup.object().shape(
		{
			firstName: yup
				.string()
				.required(sharedI18n.yup.required({ field: i18n.inputs.firstNameLabel() })),
			lastName: yup.string().optional(),
			avatar: yup.string().optional(),
			password: yup.string().when('password', {
				is: (val: string) => val?.length > 0,
				then: (schema) =>
					schema.min(8, sharedI18n.yup.min({ field: i18n.inputs.passwordLabel(), length: 8 })),
				otherwise: (schema) => schema.nullable().optional()
			}),
			confirmPassword: yup.string().when('password', {
				is: (val: string) => val?.length > 0,
				then: (schema) =>
					schema
						.oneOf([yup.ref('password')], i18n.yupMessages.confirmPassword())
						.required(sharedI18n.yup.required({ field: i18n.inputs.confirmPasswordLabel() })),
				otherwise: (schema) => schema.nullable().optional()
			})
		},
		[['password', 'password']]
	);

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;

	let password: string;
	let confirmPassword: string;

	let messages: any[] = [];

	onMount(async () => {
		avatarImageRef.src = defaultAvatarSrc;

		await loadNamespaceAsync(data.locale, 'profile');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
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
					password: password || undefined
				});

				userStore.updateUser(res.data.data);
				isLoading = false;
				erasePassword();
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
				throw new Axios.AxiosError(sharedI18n.axios.fileSizeError());
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
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		locale={data.locale}
		{showActions}
		{showRefreshButton}
		on:click={onSubmit}
	>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="image-preview">
				<img bind:this={avatarImageRef} src="" alt={i18n.profilePic.altText()} />
				<div class="overlay">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#" on:click={onAvatarInput}>{i18n.profilePic.editText()}</a>
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
					placeholder={i18n.inputs.firstNameLabel()}
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={userData.lastName}
					name="lastName"
					type="text"
					placeholder={i18n.inputs.lastNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					bind:value={userData.email}
					name="email"
					type="email"
					placeholder={i18n.inputs.emailLabel()}
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
					placeholder={i18n.inputs.passwordLabel()}
					autocomplete="new-password"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={confirmPassword}
					name="confirmPassword"
					type="password"
					minlength={8}
					placeholder={i18n.inputs.confirmPasswordLabel()}
					autocomplete="new-password"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<input
					value={translateFromEnum(userData.role, roles)}
					name="role"
					placeholder={i18n.inputs.roleLabel()}
					autocomplete="off"
					readonly
				/>
			</div>
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
