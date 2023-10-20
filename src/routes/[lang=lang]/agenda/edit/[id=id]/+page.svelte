<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { AgendaDto, FileDto } from '$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.agenda.edit

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: agendaData = (data.apiData as AgendaDto) || (form?.apiData as AgendaDto)
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'agenda')
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
	const initialFiles = fromFilenameToFileDto(data.apiData.attachments) as FileDto[]
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
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input
					value={agendaData.title}
					name="title"
					placeholder={i18n.inputs.titleLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={agendaData.message}
					formName="message"
					placeholder={i18n.inputs.messageLabel()}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					files={initialFiles}
					formName="attachments"
					accept=".pdf"
					inputLabel={i18n.inputs.attachmentsLabel()}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input value={agendaData.date.split('T')[0]} name="date" type="date" autocomplete="off" />
			</div>
			<FieldSelect value={agendaData.fieldId} />
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
