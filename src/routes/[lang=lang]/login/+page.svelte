<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { getContext, onMount } from 'svelte'
	import type { ActionData, PageData } from './$types'
	import { delay } from '$utils'
	import { goto } from '$app/navigation'
	import type { UserStore } from '$stores'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	import { browser } from '$app/environment'
	$: i18n = $LL.login

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	const userStore = getContext<UserStore>('user')

	$: messages = form?.messages ?? []
	$: messages, postActionCallback()
	$: justLoggedIn = !!form?.apiData
	$: messages || justLoggedIn, redirectLoggedIn()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'login')
		setLocale(data.locale)
	})

	async function redirectLoggedIn() {
		if (browser) {
			if (justLoggedIn) {
				await delay(1000)
				await goto(`/${data.locale}/`)
			} else if (userStore.isLoggedIn()) {
				await goto(`/${data.locale}/`)
			}
		}
	}

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
		title: i18n.authModal.title(),
		subTitle: i18n.authModal.subTitle(),
		buttonText: i18n.authModal.buttonText(),
		action: '?/post'
	}

	// Form
	let email = ''
	let password = ''
	$: isSubmitDisabled = password.length < 8 || email === ''
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AuthModal on:submit={onSubmit} {...authModal} {isLoading} {isSubmitDisabled} {messages}>
	<svelte:fragment slot="body">
		<div class="form-input">
			<Icon src={HiOutlineMail} />
			<input
				bind:value={email}
				name="email"
				type="email"
				placeholder={i18n.inputs.emailLabel()}
				autocomplete="email"
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
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/signup/step-one`}>{i18n.links.signupText()}</a>
		<a href={`/${data.locale}/forgot-password/step-one`}>{i18n.links.forgotPasswordText()}</a>
	</svelte:fragment>
</AuthModal>
