<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { AgendaDto, FileDto } from '$types'
	import { editSubmitFunction, fromFilenameToFileDto, fromStringToISOLocale } from '$utils'
	import type { ActionData, PageData } from './$types'
	import { AGENDA_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: agendaData = (data.apiData as AgendaDto) || (form?.apiData as AgendaDto)
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
		name: 'Editar Evento',
		buttonText: ''
	}

	// Form
	const initialFiles = fromFilenameToFileDto(data.apiData.attachments) as FileDto[]
</script>

<svelte:head>
	<title>Agenda</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false}>
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input
					value={agendaData.title}
					name="title"
					placeholder={AGENDA_INPUT_LABELS.title}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={agendaData.message}
					formName="message"
					placeholder={AGENDA_INPUT_LABELS.message}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					files={initialFiles}
					formName="attachments"
					inputLabel={AGENDA_INPUT_LABELS.attachments}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input
					value={fromStringToISOLocale(agendaData.date)}
					name="date"
					type="datetime-local"
					autocomplete="off"
				/>
			</div>
			<FieldSelect value={agendaData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
