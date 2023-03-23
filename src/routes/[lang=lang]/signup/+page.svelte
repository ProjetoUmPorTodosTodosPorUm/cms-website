<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte';
	import { generateMessages } from '$components/toast.svelte';
	import { delay } from '$lib/utils/functions';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import { afterNavigate, goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineKey from 'svelte-icons-pack/hi/HiOutlineKey';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed';

	import type { Navigation } from '@sveltejs/kit';
	import { MESSAGES, TEMPLATES } from '$src/lib/constants';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	const showBackButton = true;

	// Steps Handler
	const MIN_STEP = 1;
	const MAX_STEP = 3;
	const stepQueryName = 'step';
	let step = 1;

	// Make Sure all data is gathered from query if available (link from email)
	afterNavigate((navigation: Navigation) => {
		const queryStep = Number(navigation.to?.url.searchParams.get(stepQueryName));
		const queryEmail = navigation.to?.url.searchParams.get('email');
		const queryToken = navigation.to?.url.searchParams.get('token');

		// No skipping steps
		if (!Number.isNaN(queryStep) && queryStep >= MIN_STEP && queryStep <= MAX_STEP) {
			if (queryStep == 2 && !queryEmail) {
				step = 1;
			} else if ((queryStep == 3 && !queryToken) || !queryEmail) {
				if (!queryEmail) {
					step = 1;
				} else if (!queryToken) {
					step = 2;
				}
			} else {
				step = queryStep;
				email = String(queryEmail);
				const tmpTokenArr = String(queryToken ?? '').split('');
				token = tmpTokenArr.length > 0 ? tmpTokenArr : token;
			}
		} else {
			$page.url.searchParams.set('step', String(step));
			goto(`?${$page.url.searchParams.toString()}`);
		}
	});

	// AuthModal
	const title = ['Criar Conta', 'Verificação', 'Último Passo'];
	const subTitle = [
		'Por favor, insira seu e-mail',
		'Digite o seu token',
		'Preencha os dados faltantes'
	];
	const buttonText = ['Próximo', 'Validar', 'Criar Conta'];

	$: if (step === 1) {
		if (email !== '') {
			isSubmitDisabled = false;
		} else {
			isSubmitDisabled = true;
		}
	} else if (step === 2) {
		if (token.join('').length === 6) {
			isSubmitDisabled = false;
		} else {
			isSubmitDisabled = true;
		}
	} else if (step === 3) {
		if (password.length >= 8 && confirmPassword.length >= 8) {
			isSubmitDisabled = false;
		} else {
			isSubmitDisabled = true;
		}
	}

	// Form - step 1
	let email = '';
	let isSending = false;
	let isSubmitDisabled = true;

	const firstStepSchema = yup.object().shape({
		email: yup.string().required(TEMPLATES.YUP.REQUIRED('Email')).email(MESSAGES.YUP.EMAIL)
	});

	// Form - step 2
	const TOKEN_SIZE = 6;
	let token = Array(TOKEN_SIZE).fill('');
	const secondStepSchema = yup.object().shape({
		token: yup
			.string()
			.required()
			.matches(/^[A-Z0-9]{6}$/, MESSAGES.YUP.TOKEN_MATCH)
	});

	let tokenInputs: HTMLDivElement;
	function tokenDeleteHandler(event: KeyboardEvent, index: number) {
		const MIN_INDEX_FOCUS = 1;

		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.stopPropagation();
			event.preventDefault();

			token[index] = '';

			if (index >= MIN_INDEX_FOCUS) {
				// iconOffset doesn't need -1
				(tokenInputs.children[index] as HTMLInputElement).focus();
			}
		}
	}

	function tokenInputHandler(event: Event, index: number) {
		const iconOffset = 1;
		const MAX_INDEX_FOCUS = token.length - 1;
		const allowed = new RegExp(/[A-Za-z0-9]/);
		const originalValue = (tokenInputs.children[index + iconOffset] as HTMLInputElement).value;

		if (!allowed.test(originalValue)) {
			token[index] = '';
		} else {
			token[index] = originalValue.toUpperCase();
			if (index < MAX_INDEX_FOCUS) {
				(tokenInputs.children[index + iconOffset + 1] as HTMLInputElement).focus();
			}
		}
	}

	// Form - step 3
	let firstName = '';
	let lastName = '';
	let password = '';
	let confirmPassword = '';

	const thirdStepSchema = yup.object().shape({
		firstName: yup.string().required(TEMPLATES.YUP.REQUIRED('Nome')),
		lastName: yup.string().optional(),
		password: yup
			.string()
			.required(TEMPLATES.YUP.REQUIRED('Senha'))
			.min(8, TEMPLATES.YUP.MIN('Senha', 8)),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], MESSAGES.YUP.CONFIRM_PASSWORD)
			.required(TEMPLATES.YUP.REQUIRED('Confirmação da senha')),
	});

	// Toast Messages
	let messages: any[] = [];

	async function onSubmitProxy(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		switch (step) {
			case 1:
				await checkEmail();
				break;
			case 2:
				await checkTokenValidity();
				break;
			case 3:
				await createAccount();
				break;
		}
	}

	async function checkEmail() {
		try {
			firstStepSchema.validateSync({ email }, { abortEarly: false });

			step = 2;
			$page.url.searchParams.set('step', String(step));
			$page.url.searchParams.set('email', email);
			goto(`?${$page.url.searchParams.toString()}`);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	async function checkTokenValidity() {
		isSending = true;

		try {
			const isValid = secondStepSchema.validateSync(
				{ token: token.join('') },
				{ abortEarly: false }
			);
			if (isValid) {
				const res = await axios.post('/auth/token-validate', { email, token: token.join('') });
				if (!res) {
					messages = generateMessages([{ message: 'Servidor não está disponível' }]);
					isSending = false;
					return;
				}
				isSending = false;

				const isTokenValid = res.data.data;
				if (isTokenValid) {
					messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
					await delay(1000);

					step = 3;
					$page.url.searchParams.set('step', String(step));
					$page.url.searchParams.set('token', token.join(''));
					goto(`?${$page.url.searchParams.toString()}`);
				} else {
					messages = generateMessages([
						{ message: MESSAGES.AUTH.TOKEN_INVALID, variant: 'danger' }
					]);
					await delay(1000);
				}
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

	async function createAccount() {
		isSending = true;

		try {
			const isValid = thirdStepSchema.validateSync(
				{ firstName, lastName, password, confirmPassword },
				{ abortEarly: false }
			);
			if (isValid) {
				const res = await axios.post('/auth/create-email/confirm', {
					firstName,
					lastName,
					email,
					token: token.join(''),
					password,
				});
				if (!res) {
					messages = generateMessages([{ message: 'Servidor não está disponível' }]);
					isSending = false;
					return;
				}
				isSending = false;

				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
				await delay(1000);
				await goto(`/${data.locale}/login`);
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

	async function onClose(event: CustomEvent) {
		const id = event.detail;

		await delay(500);
		messages = messages.filter((message) => message.id != id);
	}
</script>

<svelte:head>
	<title>Create Account</title>
</svelte:head>

<AuthModal
	on:submit={onSubmitProxy}
	on:toastClose={onClose}
	title={title[step - 1]}
	subTitle={subTitle[step - 1]}
	buttonText={buttonText[step - 1]}
	{isSending}
	{isSubmitDisabled}
	{messages}
	{showBackButton}
>
	<svelte:fragment slot="body">
		{#if step == 1}
			<div class="form-input" in:fade>
				<Icon src={HiOutlineMail} />
				<input
					bind:value={email}
					name="email"
					type="email"
					autocomplete="off"
					placeholder="Email"
					required
				/>
			</div>
		{:else if step == 2}
			<div bind:this={tokenInputs} class="form-input token-form-input" in:fade>
				<Icon src={HiOutlineKey} />
				<input
					bind:value={token[0]}
					on:input={(event) => tokenInputHandler(event, 0)}
					on:keydown={(event) => tokenDeleteHandler(event, 0)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
				<input
					bind:value={token[1]}
					on:input={(event) => tokenInputHandler(event, 1)}
					on:keydown={(event) => tokenDeleteHandler(event, 1)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
				<input
					bind:value={token[2]}
					on:input={(event) => tokenInputHandler(event, 2)}
					on:keydown={(event) => tokenDeleteHandler(event, 2)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
				<input
					bind:value={token[3]}
					on:input={(event) => tokenInputHandler(event, 3)}
					on:keydown={(event) => tokenDeleteHandler(event, 3)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
				<input
					bind:value={token[4]}
					on:input={(event) => tokenInputHandler(event, 4)}
					on:keydown={(event) => tokenDeleteHandler(event, 4)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
				<input
					bind:value={token[5]}
					on:input={(event) => tokenInputHandler(event, 5)}
					on:keydown={(event) => tokenDeleteHandler(event, 5)}
					class="token-input"
					name="token"
					maxlength="1"
					required
				/>
			</div>
		{:else if step == 3}
			<div class="form-input" in:fade>
				<Icon src={HiOutlineUser} />
				<input
					bind:value={firstName}
					name="firstName"
					type="text"
					placeholder="Primeiro Nome"
					autocomplete="off"
					required
				/>
			</div>
			<div class="form-input" in:fade>
				<Icon src={HiOutlineUser} />
				<input
					bind:value={lastName}
					name="lastName"
					type="text"
					placeholder="Sobrenome"
					autocomplete="off"
				/>
			</div>
			<div class="form-input" in:fade>
				<Icon src={HiOutlineLockClosed} />
				<input
					bind:value={password}
					name="password"
					type="password"
					autocomplete="new-password"
					placeholder="Senha"
					required
				/>
			</div>
			<div class="form-input" in:fade>
				<Icon src={HiOutlineLockClosed} />
				<input
					bind:value={confirmPassword}
					name="confirmPassword"
					type="password"
					autocomplete="new-password"
					placeholder="Repita a Senha"
					required
				/>
			</div>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/login`}>Login</a>
		<a href={`/${data.locale}/forgot-password`}>Recuperar Conta</a>
	</svelte:fragment>
</AuthModal>
