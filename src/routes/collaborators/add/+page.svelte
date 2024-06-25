<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFile, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { COLLABORATORS_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineUserGroup } from 'svelte-icons-pack/hi'

	export let form: ActionData
	let isLoading = false
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
		name: 'Adicionar Colaborador',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Colaboradores</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<input name="title" placeholder={COLLABORATORS_INPUT_LABELS.title} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="description" placeholder={COLLABORATORS_INPUT_LABELS.description} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFile formName="image" accept="image/*" inputLabel={COLLABORATORS_INPUT_LABELS.image} />
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
