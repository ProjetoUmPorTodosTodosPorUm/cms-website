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
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus';

	import type { Navigation } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	import { onMount } from 'svelte';
	$: i18n = $LL.signup;
	$: sharedI18n = $LL.shared;

	export let data: PageData;

	const showBackButton = true;

	// Steps Handler
	const MIN_STEP = 1;
	const MAX_STEP = 3;
	const stepQueryName = 'step';
	let step = 1;

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'signup');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

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
	$: authModal = {
		title: i18n.authModal[step - 1].title(),
		subTitle: i18n.authModal[step - 1].subTitle(),
		buttonText: i18n.authModal[step - 1].buttonText()
	};

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

	$: firstStepSchema = yup.object().shape({
		email: yup
			.string()
			.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.emailLabel() }))
	});

	// Form - step 2
	const TOKEN_SIZE = 6;
	let token = Array(TOKEN_SIZE).fill('');
	$: secondStepSchema = yup.object().shape({
		token: yup
			.string()
			.matches(/^[A-Z0-9]{6}$/, i18n.yupMessages.tokenMatch())
			.required(sharedI18n.yup.required({ field: i18n.inputs.tokenLabel() }))
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

	$: thirdStepSchema = yup.object().shape({
		firstName: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.firstNameLabel() })),
		lastName: yup.string().optional(),
		password: yup
			.string()
			.min(8, sharedI18n.yup.min({ field: i18n.inputs.passwordLabel(), length: 8 }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.passwordLabel() })),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], i18n.yupMessages.confirmPassword())
			.required(sharedI18n.yup.required({ field: i18n.inputs.confirmPasswordLabel() }))
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
					messages = generateMessages([{ message: sharedI18n.axios.serverNotAvailable() }]);
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
						{ message: i18n.yupMessages.tokenInvalid(), variant: 'danger' }
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
					password
				});
				if (!res) {
					messages = generateMessages([{ message: sharedI18n.axios.serverNotAvailable() }]);
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
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AuthModal
	on:submit={onSubmitProxy}
	on:toastClose={onClose}
	{...authModal}
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
					placeholder={i18n.inputs.emailLabel()}
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
					placeholder={i18n.inputs.firstNameLabel()}
					autocomplete="off"
					required
				/>
			</div>
			<div class="form-input" in:fade>
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={lastName}
					name="lastName"
					type="text"
					placeholder={i18n.inputs.lastNameLabel()}
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
					placeholder={i18n.inputs.passwordLabel()}
					required
				/>
			</div>
			<div class="form-input" in:fade>
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={confirmPassword}
					name="confirmPassword"
					type="password"
					autocomplete="new-password"
					placeholder={i18n.inputs.confirmPasswordLabel()}
					required
				/>
			</div>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/login`}>{i18n.links.loginText()}</a>
		<a href={`/${data.locale}/forgot-password`}>{i18n.links.forgotPasswordText()}</a>
	</svelte:fragment>
</AuthModal>
