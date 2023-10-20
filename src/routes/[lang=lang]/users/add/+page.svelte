<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.users.add

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'users')
		setLocale(data.locale)
	})

	async function postActionCallback() {
		// ignore first loading triggering
		if (isLoading && messages.length > 0) {
			isLoading = false
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: ''
	}

	// Form
	$: roles = [
		{ value: 'VOLUNTEER', text: i18n.roles.volunteer() },
		{ value: 'ADMIN', text: i18n.roles.admin() },
		{ value: 'WEB_MASTER', text: i18n.roles.webMaster() }
	]
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
		locale={data.locale}
	>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="name" type="text" placeholder={i18n.inputs.nameLabel()} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					name="email"
					type="email"
					placeholder={i18n.inputs.emailLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<select name="role">
					<option value="" disabled selected>{i18n.inputs.roleLabel()}</option>
					{#each roles as role}
						<option value={role.value}>
							{role.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect />
			<div class="input">
				<input class="submit" type="submit" value={i18n.appHeader.buttonText()} />
			</div>
		</form>
	</AppContent>
</AppContainer>
