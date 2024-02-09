<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, FieldSelect } from '$components'
	import type { TestimonialDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$src/lib/utils'
	import { TESTIMONIALS_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: testimonialData = (data.apiData as TestimonialDto) || (form?.apiData as TestimonialDto)
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
		name: 'Editar Testemunho',
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
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={testimonialData.name}
					name="name"
					placeholder={TESTIMONIALS_INPUT_LABELS.name}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					value={testimonialData.email}
					name="email"
					placeholder={TESTIMONIALS_INPUT_LABELS.email}
					type="email"
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={testimonialData.text}
					formName="text"
					placeholder={TESTIMONIALS_INPUT_LABELS.text}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<FieldSelect value={testimonialData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
