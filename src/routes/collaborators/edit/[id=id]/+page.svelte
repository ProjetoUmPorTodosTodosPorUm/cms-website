<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFile, FieldSelect } from '$components'
	import type { CollaboratorDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import { COLLABORATORS_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: collaboratorData = (data.apiData as CollaboratorDto) || (form?.apiData as CollaboratorDto)
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

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
		name: 'Editar Colaborador',
		buttonText: ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.image || '') as FileDto
</script>

<svelte:head>
	<title>Colaboradores</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
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
					placeholder={COLLABORATORS_INPUT_LABELS.title}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={collaboratorData.description}
					formName="description"
					placeholder={COLLABORATORS_INPUT_LABELS.description}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFile
					file={initialFile}
					formName="image"
					accept="image/*"
					inputLabel={COLLABORATORS_INPUT_LABELS.image}
				/>
			</div>
			<FieldSelect value={collaboratorData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
