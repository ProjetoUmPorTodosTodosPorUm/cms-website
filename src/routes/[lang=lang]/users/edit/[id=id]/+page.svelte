<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, ImageInput, FieldSelect } from '$components'
	import type { FileDto, UserDto } from '$types'
	import type { PageData, ActionData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.users.edit

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages || (data.messages as any[])
	$: messages, postActionCallback()
	$: userData = (data.apiData as UserDto) || (form?.apiData as UserDto)

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'users')
		setLocale(data.locale)
	})

	function postActionCallback() {
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
	const initialFile = fromFilenameToFileDto(data.apiData.avatar || '') as FileDto
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
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<ImageInput
				file={initialFile}
				formName="avatar"
				altText={i18n.profilePic.altText()}
				inputLabel={i18n.profilePic.editText()}
			/>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={userData.firstName}
					name="firstName"
					type="text"
					placeholder={i18n.inputs.firstNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={userData.lastName}
					name="lastName"
					type="text"
					placeholder={i18n.inputs.lastNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<select value={userData.role} name="role">
					<option value="" disabled selected>{i18n.inputs.roleLabel()}</option>
					{#each roles as role}
						<option value={role.value}>
							{role.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={userData.fieldId} />
			<div class="input">
				<input class="submit" type="submit" value={i18n.appHeader.buttonText()} />
			</div>
		</form>
	</AppContent>
</AppContainer>
