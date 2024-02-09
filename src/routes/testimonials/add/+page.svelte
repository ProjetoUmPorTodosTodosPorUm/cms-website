<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { TESTIMONIALS_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'

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
		name: 'Adicionar Testemunho',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Testemunhos</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
		on:click={onSubmit}
	>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="name" placeholder={TESTIMONIALS_INPUT_LABELS.name} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					name="email"
					placeholder={TESTIMONIALS_INPUT_LABELS.email}
					type="email"
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="text" placeholder={TESTIMONIALS_INPUT_LABELS.text} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
