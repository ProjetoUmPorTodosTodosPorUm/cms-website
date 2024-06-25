<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { AnnouncementDto, FileDto } from '$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import type { ActionData, PageData } from './$types'
	import { ANNOUNCEMENTS_INPUT_LABEL } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineMegaphone } from 'svelte-icons-pack/hi'
	import { BsPinAngle } from 'svelte-icons-pack/bs'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: announcementData = (data.apiData as AnnouncementDto) || (form?.apiData as AnnouncementDto)
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
		name: 'Editar Aviso',
		buttonText: ''
	}

	// Form
	const initialFiles = fromFilenameToFileDto(data.apiData.attachments) as FileDto[]
</script>

<svelte:head>
	<title>Avisos</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false}>
		<form class="app-form" method="POST" action="?/put" use:enhance={editSubmitFunction} on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineMegaphone} />
				<input
					bind:value={announcementData.title}
					name="title"
					placeholder={ANNOUNCEMENTS_INPUT_LABEL.title}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={announcementData.message}
					formName="message"
					placeholder={ANNOUNCEMENTS_INPUT_LABEL.message}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles files={initialFiles} formName="attachments" inputLabel={ANNOUNCEMENTS_INPUT_LABEL.attachments} />
			</div>
			<div class="input">
				<Icon src={BsPinAngle} />
				<div class="radio">
					<label for="#">{ANNOUNCEMENTS_INPUT_LABEL.yes}</label>
					<input bind:group={announcementData.fixed} name="fixed" type="radio" value={true} />
				</div>
				<div class="radio">
					<label for="#">{ANNOUNCEMENTS_INPUT_LABEL.no}</label>
					<input bind:group={announcementData.fixed} name="fixed" type="radio" value={false} />
				</div>
			</div>
			<FieldSelect value={announcementData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
