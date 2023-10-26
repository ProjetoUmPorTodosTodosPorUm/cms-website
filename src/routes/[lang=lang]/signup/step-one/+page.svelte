<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { onMount } from 'svelte'
	import type { PageData, ActionData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'

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

		loadQuery()
	})

	function loadQuery() {
		email = $page.url.searchParams.get('email') || ''
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.step && form?.email) {
			const nextPage = `/${data.locale}/signup/step-${form?.step}?email=${form?.email}`
			await goto(nextPage)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: i18n.authModal[0].title(),
		subTitle: i18n.authModal[0].subTitle(),
		buttonText: i18n.authModal[0].buttonText(),
		action: '?/post'
	}

	// Form
	$: isSubmitDisabled = email.length === 0
	let email = ''
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
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
			<Icon src={HiOutlineMail} />
			<input
				bind:value={email}
				name="email"
				type="email"
				autocomplete="off"
				placeholder={i18n.inputs.emailLabel()}
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/login`}>{i18n.links.loginText()}</a>
		<a href={`/${data.locale}/forgot-password/step-one`}>{i18n.links.forgotPasswordText()}</a>
	</svelte:fragment>
</AuthModal>
