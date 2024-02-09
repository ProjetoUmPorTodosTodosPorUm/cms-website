<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { AGENDA_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'

	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	async function postActionCallback() {
		// ignore first loading triggering
		if (isLoading && messages.length > 0) {
			isLoading = false

			if ($page.status === 200) {
				resetFiles()
			}
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// App Header
	$: appHeader = {
		name: 'Adicionar Evento',
		buttonText: ''
	}

	// Form
	let resetFiles: () => void
</script>

<svelte:head>
	<title>Agenda</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input name="title" placeholder={AGENDA_INPUT_LABELS.title} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="message" placeholder={AGENDA_INPUT_LABELS.message} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					formName="attachments"
					inputLabel={AGENDA_INPUT_LABELS.attachments}
					bind:resetFiles
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input name="date" type="datetime-local" autocomplete="off" />
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
