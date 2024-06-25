<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { ANNOUNCEMENTS_INPUT_LABEL } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineMegaphone } from 'svelte-icons-pack/hi'
	import { BsPinAngle } from 'svelte-icons-pack/bs'

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
		name: 'Adicionar Aviso',
		buttonText: ''
	}

	// Form
	let resetFiles: () => void
</script>

<svelte:head>
	<title>Avisos</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineMegaphone} />
				<input name="title" placeholder={ANNOUNCEMENTS_INPUT_LABEL.title} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="message" placeholder={ANNOUNCEMENTS_INPUT_LABEL.message} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles formName="attachments" inputLabel={ANNOUNCEMENTS_INPUT_LABEL.attachments} bind:resetFiles />
			</div>
			<div class="input">
				<Icon src={BsPinAngle} />
				<div class="radio">
					<label for="#">{ANNOUNCEMENTS_INPUT_LABEL.yes}</label>
					<input name="fixed" type="radio" value={true} />
				</div>
				<div class="radio">
					<label for="#">{ANNOUNCEMENTS_INPUT_LABEL.no}</label>
					<input name="fixed" type="radio" value={false} />
				</div>
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
