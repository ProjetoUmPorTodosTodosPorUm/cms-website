<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { FORGOT_PASSWORD_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineLockClosed } from 'svelte-icons-pack/hi'

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
				await goto(`/forgot-password/step-one`)
			} else {
				await goto(`/forgot-password/step-two?email=${email}`)
			}
		}
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.finished) {
			await goto(`forgot-password/finished?email=${form?.email}`)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: 'Último Passado',
		subTitle: 'Por favor, sua nova senha',
		buttonText: 'Salvar Nova Senha',
		action: '?/post'
	}

	// Form
	$: isSubmitDisabled = password.length === 0 && confirmPassword.length === 0
	let email = ''
	let token = ''

	let password = ''
	let confirmPassword = ''
</script>

<AuthModal on:submit={onSubmit} {...authModal} {isLoading} {isSubmitDisabled} {messages} showBackButton={true}>
	<svelte:fragment slot="body">
		<input name="email" type="email" value={email} hidden={true} />
		<input name="token" type="text" value={token} hidden={true} />

		<div class="form-input" in:fade>
			<Icon src={HiOutlineLockClosed} />
			<input
				bind:value={password}
				name="password"
				type="password"
				autocomplete="new-password"
				placeholder={FORGOT_PASSWORD_INPUT_LABELS.password}
			/>
		</div>
		<div class="form-input" in:fade>
			<input
				bind:value={confirmPassword}
				name="confirmPassword"
				type="password"
				autocomplete="new-password"
				placeholder={FORGOT_PASSWORD_INPUT_LABELS.confirmPassword}
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/login`}>Login</a>
		<a href={`/signup/step-one`}>Criar Conta</a>
	</svelte:fragment>
</AuthModal>
