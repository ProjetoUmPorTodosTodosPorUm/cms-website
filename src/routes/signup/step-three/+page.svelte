<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { SIGN_UP_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineUser, HiOutlineLockClosed } from 'svelte-icons-pack/hi'

	export let form: ActionData
	let isLoading = false

	$: messages = form?.messages ?? []
	$: form, postActionCallback()

	onMount(async () => {
		await loadQuery()
	})

	async function loadQuery() {
		email = $page.url.searchParams.get('email') || ''
		token = $page.url.searchParams.get('token') || ''

		if (!token) {
			if (!email) {
				await goto(`/signup/step-one`)
			} else {
				await goto(`/signup/step-two?email=${email}`)
			}
		}
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.finished) {
			await goto(`/signup/finished?name=${form?.name}`)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: 'Último Passo',
		subTitle: 'Preencha os dados faltantes',
		buttonText: 'Criar Conta',
		action: '?/post'
	}

	// Form
	$: isSubmitDisabled = firstName.length === 0 || (password.length === 0 && confirmPassword.length === 0)
	let email = ''
	let token = ''

	let firstName = ''
	let lastName = ''
	let password = ''
	let confirmPassword = ''
</script>

<AuthModal on:submit={onSubmit} {...authModal} {isLoading} {isSubmitDisabled} {messages} showBackButton={true}>
	<svelte:fragment slot="body">
		<input name="email" type="email" value={email} hidden={true} />
		<input name="token" type="text" value={token} hidden={true} />

		<div class="form-input" in:fade>
			<Icon src={HiOutlineUser} />
			<input
				bind:value={firstName}
				name="firstName"
				type="text"
				placeholder={SIGN_UP_INPUT_LABELS.firstName}
				autocomplete="off"
			/>
		</div>
		<div class="form-input" in:fade>
			<input
				bind:value={lastName}
				name="lastName"
				type="text"
				placeholder={SIGN_UP_INPUT_LABELS.lastName}
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
				placeholder={SIGN_UP_INPUT_LABELS.password}
			/>
		</div>
		<div class="form-input" in:fade>
			<input
				bind:value={confirmPassword}
				name="confirmPassword"
				type="password"
				autocomplete="new-password"
				placeholder={SIGN_UP_INPUT_LABELS.confirmPassword}
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/login`}>Login</a>
		<a href={`/forgot-password/step-one`}>Recuperar Conta</a>
	</svelte:fragment>
</AuthModal>
