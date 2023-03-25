<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { delay } from '$lib/utils/functions';
	import { UserStore } from '$lib/store/user';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import * as yup from 'yup';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed';
	import type { PageData } from './$types';
	import { MESSAGES, TEMPLATES } from '$src/lib/constants';

	export let data: PageData;

	let userStore: UserStore;
	onMount(() => {
		userStore = new UserStore();
	});

	// AuthModal
	const title = 'Projeto Um Por Todos! Todos Por Um.';
	const subTitle = 'Bem-vindo de Volta';
	const buttonText = 'Entrar';

	// Form
	let email = '';
	let password = '';
	let isSending = false;
	$: isSubmitDisabled = password.length < 8 || email === '';

	const schema = yup.object().shape({
		email: yup.string().required(TEMPLATES.YUP.REQUIRED('Email')).email(MESSAGES.YUP.EMAIL),
		password: yup.string().required().min(8, TEMPLATES.YUP.MIN('Senha', 8))
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
	<title>Login</title>
</svelte:head>

<AuthModal
	on:submit={onSubmit}
	{title}
	{subTitle}
	{buttonText}
	{isSending}
	{isSubmitDisabled}
	{messages}
>
	<svelte:fragment slot="body">
		<div class="form-input">
			<Icon src={HiOutlineMail} />
			<input
				bind:value={email}
				name="email"
				type="email"
				placeholder="Email"
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
				placeholder="Senha"
				autocomplete="current-password"
				required
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/signup`}>Criar Conta</a>
		<a href={`/${data.locale}/forgot-password`}>Recuperar Conta</a>
	</svelte:fragment>
</AuthModal>
