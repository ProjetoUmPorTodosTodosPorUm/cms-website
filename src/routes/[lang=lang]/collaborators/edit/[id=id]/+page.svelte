<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFile, FieldSelect } from '$components'
	import type { CollaboratorDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.collaborators.edit

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: collaboratorData = (data.apiData as CollaboratorDto) || (form?.apiData as CollaboratorDto)
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'collaborators')
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
	const initialFile = fromFilenameToFileDto(data.apiData.image || '') as FileDto
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
		on:click={onSubmit}
	>
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<input
					value={collaboratorData.title}
					name="title"
					placeholder={i18n.inputs.titleLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={collaboratorData.description}
					formName="description"
					placeholder={i18n.inputs.descriptionLabel()}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFile
					file={initialFile}
					formName="image"
					accept="image/*"
					inputLabel={i18n.inputs.imageLabel()}
				/>
			</div>
			<FieldSelect value={collaboratorData.fieldId} />
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
