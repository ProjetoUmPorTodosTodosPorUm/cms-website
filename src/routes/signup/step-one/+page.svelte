<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { SIGN_UP_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineEnvelope } from 'svelte-icons-pack/hi'

	export let form: ActionData
	let isLoading = false

	$: messages = form?.messages ?? []
	$: form, postActionCallback()

	onMount(async () => {
		loadQuery()
	})

	function loadQuery() {
		email = $page.url.searchParams.get('email') || ''
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.step && form?.email) {
			const nextPage = `/signup/step-${form?.step}?email=${form?.email}`
			await goto(nextPage)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: 'Criar Conta',
		subTitle: 'Por favor, insira seu e-mail',
		buttonText: 'Próximo',
		action: '?/post'
	}

	// Form
	$: isSubmitDisabled = email.length === 0
	let email = ''
</script>

<svelte:head>
	<title>Criar Conta</title>
</svelte:head>

<AuthModal
	on:submit={onSubmit}
	{...authModal}
	{isLoading}
	{isSubmitDisabled}
	{messages}
	showBackButton={true}
>
	<svelte:fragment slot="body">
		<div class="form-input">
			<Icon src={HiOutlineEnvelope} />
			<input
				bind:value={email}
				name="email"
				type="email"
				autocomplete="off"
				placeholder={SIGN_UP_INPUT_LABELS.email}
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/login`}>Login</a>
		<a href={`/forgot-password/step-one`}>Recuperar Conta</a>
	</svelte:fragment>
</AuthModal>
