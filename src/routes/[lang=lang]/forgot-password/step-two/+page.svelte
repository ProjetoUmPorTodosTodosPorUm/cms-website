<script lang="ts">
	import AuthModal from '$components/auth-modal.svelte'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import type { PageData, ActionData } from './$types'
	import { page } from '$app/stores'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineKey from 'svelte-icons-pack/hi/HiOutlineKey'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['forgot-password']

	export let data: PageData
	export let form: ActionData
	let isLoading = false

	$: messages = form?.messages ?? []
	$: form, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'forgot-password')
		setLocale(data.locale)

		await loadQuery()
	})

	async function loadQuery() {
		email = $page.url.searchParams.get('email') || ''
		token = $page.url.searchParams.get('token')?.split('') || []

		if (!email) {
			await goto(`/${data.locale}/forgot-password/step-one`)
		}
	}

	async function postActionCallback() {
		isLoading = false
		if (form?.step && form?.email && form?.token) {
			const nextPage = `/${data.locale}/forgot-password/step-${form?.step}?email=${form?.email}&token=${form.token}`
			await goto(nextPage)
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// AuthModal
	$: authModal = {
		title: i18n.authModal[1].title(),
		subTitle: i18n.authModal[1].subTitle(),
		buttonText: i18n.authModal[1].buttonText(),
		action: '?/post'
	}

	// Form
	const TOKEN_SIZE = 6
	$: isSubmitDisabled = token.length !== TOKEN_SIZE
	let email = ''
	let token = Array(TOKEN_SIZE).fill('')
	let tokenInputs: HTMLDivElement

	function tokenDeleteHandler(event: KeyboardEvent, index: number) {
		const MIN_INDEX_FOCUS = 1

		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.stopPropagation()
			event.preventDefault()

			token[index] = ''

			if (index >= MIN_INDEX_FOCUS) {
				// iconOffset doesn't need -1
				;(tokenInputs.children[index] as HTMLInputElement).focus()
			}
		}
	}

	function tokenInputHandler(event: Event, index: number) {
		const iconOffset = 1
		const MAX_INDEX_FOCUS = token.length - 1
		const allowed = new RegExp(/[A-Za-z0-9]/)
		const originalValue = (tokenInputs.children[index + iconOffset] as HTMLInputElement).value

		if (!allowed.test(originalValue)) {
			token[index] = ''
		} else {
			token[index] = originalValue.toUpperCase()
			if (index <= MAX_INDEX_FOCUS) {
				;(tokenInputs.children[index + iconOffset + 1] as HTMLInputElement).focus()
			}
		}
	}
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
		<input name="email" type="email" value={email} hidden={true} />

		<div bind:this={tokenInputs} class="form-input token-form-input">
			<Icon src={HiOutlineKey} />
			<input
				bind:value={token[0]}
				on:input={(event) => tokenInputHandler(event, 0)}
				on:keydown={(event) => tokenDeleteHandler(event, 0)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
			<input
				bind:value={token[1]}
				on:input={(event) => tokenInputHandler(event, 1)}
				on:keydown={(event) => tokenDeleteHandler(event, 1)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
			<input
				bind:value={token[2]}
				on:input={(event) => tokenInputHandler(event, 2)}
				on:keydown={(event) => tokenDeleteHandler(event, 2)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
			<input
				bind:value={token[3]}
				on:input={(event) => tokenInputHandler(event, 3)}
				on:keydown={(event) => tokenDeleteHandler(event, 3)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
			<input
				bind:value={token[4]}
				on:input={(event) => tokenInputHandler(event, 4)}
				on:keydown={(event) => tokenDeleteHandler(event, 4)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
			<input
				bind:value={token[5]}
				on:input={(event) => tokenInputHandler(event, 5)}
				on:keydown={(event) => tokenDeleteHandler(event, 5)}
				class="token-input"
				name="token"
				maxlength="1"
				autocomplete="off"
			/>
		</div>
	</svelte:fragment>

	<svelte:fragment slot="links">
		<a href={`/${data.locale}/login`}>{i18n.links.loginText()}</a>
		<a href={`/${data.locale}/signup/step-one`}>{i18n.links.signupText()}</a>
	</svelte:fragment>
</AuthModal>
