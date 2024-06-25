<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFile, FieldSelect } from '$components'
	import type { RecoveryHouseDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import { RECOVERY_HOUSES_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineUserGroup } from 'svelte-icons-pack/hi'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: recoveryHouseData = (data.apiData as RecoveryHouseDto) || (form?.apiData as RecoveryHouseDto)
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
		name: 'Editar Casa de Recuperação',
		buttonText: ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.image || '') as FileDto
</script>

<svelte:head>
	<title>Casas de Recuperação</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/put" use:enhance={editSubmitFunction} on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<input
					value={recoveryHouseData.title}
					name="title"
					placeholder={RECOVERY_HOUSES_INPUT_LABELS.title}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={recoveryHouseData.description}
					formName="description"
					placeholder={RECOVERY_HOUSES_INPUT_LABELS.description}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFile
					file={initialFile}
					formName="image"
					accept="image/*"
					inputLabel={RECOVERY_HOUSES_INPUT_LABELS.image}
				/>
			</div>
			<FieldSelect value={recoveryHouseData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
