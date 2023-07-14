<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { delay } from '$lib/utils/functions';
	import type { UserStore } from '$lib/store/user';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import * as yup from 'yup';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed';
	import type { PageData } from './$types';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.login;
	$: sharedI18n = $LL.shared;

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'login');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

	// AuthModal
	$: authModal = {
		title: i18n.authModal.title(),
		subTitle: i18n.authModal.subTitle(),
		buttonText: i18n.authModal.buttonText()
	};

	// Form
	let email = '';
	let password = '';
	let isSending = false;
	$: isSubmitDisabled = password.length < 8 || email === '';

	$: schema = yup.object().shape({
		email: yup
			.string()
			.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.emailLabel() })),
		password: yup
			.string()
			.min(8, sharedI18n.yup.min({ field: i18n.inputs.passwordLabel(), length: 8 }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.passwordLabel() }))
	});

	// Toast Messages
	let messages: any[] = [];

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isSending = true;

		try {
			const isValid = schema.validateSync({ email, password }, { abortEarly: false });
			if (isValid) {
				const res = await axios.post('/auth/signin', { email, password });
				isSending = false;

				userStore.updateStore(res.data.data);
				messages = [{ message: res.data.message, id: Date.now(), variant: 'success' }];
				await delay(1000);
				await goto(`/${data.locale}`);
			}
		} catch (error) {
			isSending = false;
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
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AuthModal
	on:submit={onSubmit}
	{...authModal}
	{isSending}
	{isSubmitDisabled}
	{messages}
	locale={data.locale}
>
	<svelte:fragment slot="body">
		<div class="form-input">
			<Icon src={HiOutlineMail} />
			<input
				bind:value={email}
				name="email"
				type="email"
				placeholder={i18n.inputs.emailLabel()}
				autocomplete="email"
				required
			/>
		</div>
		<div class="form-input">
			<Icon src={HiOutlineLockClosed} />
			<input
				bind:value={password}
				name="password"
				type="password"
				minlength={8}
				placeholder={i18n.inputs.passwordLabel()}
				autocomplete="current-password"
				required
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/signup?step=1`}>{i18n.links.signupText()}</a>
		<a href={`/${data.locale}/forgot-password`}>{i18n.links.forgotPasswordText()}</a>
	</svelte:fragment>
</AuthModal>
