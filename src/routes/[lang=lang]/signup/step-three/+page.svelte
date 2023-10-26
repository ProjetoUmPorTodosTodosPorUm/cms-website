<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'
	import type { PageData, ActionData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.signup

	export let data: PageData
	export let form: ActionData
	let isLoading = false

	$: messages = form?.messages ?? []
	$: form, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'signup')
		setLocale(data.locale)

		await loadQuery()
	})

	async function loadQuery() {
		email = $page.url.searchParams.get('email') || ''
		token = $page.url.searchParams.get('token') || ''

		if (!token) {
			if (!email) {
				await goto(`/${data.locale}/signup/step-one`)
			} else {
				await goto(`/${data.locale}/signup/step-two?email=${email}`)
			}
		}
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.finished) {
			await goto(`/${data.locale}/signup/finished?name=${form?.name}`)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: i18n.authModal[2].title(),
		subTitle: i18n.authModal[2].subTitle(),
		buttonText: i18n.authModal[2].buttonText(),
		action: '?/post'
	}

	// Form
	$: isSubmitDisabled =
		firstName.length === 0 || (password.length === 0 && confirmPassword.length === 0)
	let email = ''
	let token = ''

	let firstName = ''
	let lastName = ''
	let password = ''
	let confirmPassword = ''
</script>

<AuthModal
	on:submit={onSubmit}
	{...authModal}
	{isLoading}
	{isSubmitDisabled}
	{messages}
	showBackButton={true}
>
	<svelte:fragment slot="body">
		<input name="email" type="email" value={email} hidden={true} />
		<input name="token" type="text" value={token} hidden={true} />

		<div class="form-input" in:fade>
			<Icon src={HiOutlineUser} />
			<input
				bind:value={firstName}
				name="firstName"
				type="text"
				placeholder={i18n.inputs.firstNameLabel()}
				autocomplete="off"
			/>
		</div>
		<div class="form-input" in:fade>
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
			/>
		</div>
		<div class="form-input" in:fade>
			<input
				bind:value={confirmPassword}
				name="confirmPassword"
				type="password"
				autocomplete="new-password"
				placeholder={i18n.inputs.confirmPasswordLabel()}
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/login`}>{i18n.links.loginText()}</a>
		<a href={`/${data.locale}/forgot-password/step-one`}>{i18n.links.forgotPasswordText()}</a>
	</svelte:fragment>
</AuthModal>
