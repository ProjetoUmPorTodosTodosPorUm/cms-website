<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ChurchDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$src/lib/utils'
	import { CHURCHES_INPUT_LABELS, CHURCH_TYPES } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineBuildingLibrary, HiOutlineTag } from 'svelte-icons-pack/hi'

	export let data: PageData
	export let form: ActionData

	let isLoading = false
	$: churchData = (data.apiData as ChurchDto) || (form?.apiData as ChurchDto)
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
		name: 'Editar Igreja em Unidade',
		buttonText: ''
	}

	// Form
	const initialFiles = fromFilenameToFileDto(data.apiData.images) as FileDto[]
	$: churchTypes = [
		{ value: 'PIONEER', text: CHURCH_TYPES.pioneer },
		{ value: 'EXPANSION', text: CHURCH_TYPES.expansion },
		{ value: 'SUPPORT', text: CHURCH_TYPES.support },
		{ value: 'RESPONSIBLE', text: CHURCH_TYPES.responsible }
	]
</script>

<svelte:head>
	<title>Igrejas em Unidade</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/put" use:enhance={editSubmitFunction} on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineBuildingLibrary} />
				<input bind:value={churchData.name} name="name" placeholder={CHURCHES_INPUT_LABELS.name} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					formName="description"
					value={churchData.description}
					placeholder={CHURCHES_INPUT_LABELS.description}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles files={initialFiles} formName="images" accept="image/*" inputLabel={CHURCHES_INPUT_LABELS.images} />
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={churchData.type} name="type">
					<option value="" disabled selected>{CHURCHES_INPUT_LABELS.type}</option>

					{#each churchTypes as churchType}
						<option value={churchType.value}>{churchType.text}</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={churchData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
