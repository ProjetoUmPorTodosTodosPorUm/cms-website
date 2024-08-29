<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import type { ActionData } from './$types'
	import { LOGIN_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineEnvelope, HiOutlineLockClosed } from 'svelte-icons-pack/hi'

	export let form: ActionData
	let isLoading = false

	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	async function postActionCallback() {
		// ignore first loading triggering
		if (messages.length > 0) {
			isLoading = false
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: 'Projeto Um Por Todos! Todos Por Um.',
		subTitle: 'Bem-vindo de Volta',
		buttonText: 'Entrar',
		action: '?/post'
	}

	// Form
	let email = ''
	let password = ''
	$: isSubmitDisabled = password.length < 8 || email === ''
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<AuthModal on:submit={onSubmit} {...authModal} {isLoading} {isSubmitDisabled} {messages}>
	<svelte:fragment slot="body">
		<div class="form-input">
			<Icon src={HiOutlineEnvelope} />
			<input bind:value={email} name="email" type="email" placeholder={LOGIN_INPUT_LABELS.email} autocomplete="email" />
		</div>
		<div class="form-input">
			<Icon src={HiOutlineLockClosed} />
			<input
				bind:value={password}
				name="password"
				type="password"
				minlength={8}
				placeholder={LOGIN_INPUT_LABELS.password}
				autocomplete="current-password"
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/signup/step-one`}>Criar Conta</a>
		<a href={`/forgot-password/step-one`}>Recuperar Conta</a>
	</svelte:fragment>
</AuthModal>
