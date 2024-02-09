<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { CHURCHES_INPUT_LABELS, CHURCH_TYPES } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag'

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
		name: 'Adicionar Igreja em Unidade',
		buttonText: ''
	}

	// Form
	let resetFiles: () => void
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
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
		on:click={onSubmit}
	>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input name="name" placeholder={CHURCHES_INPUT_LABELS.name} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="description" placeholder={CHURCHES_INPUT_LABELS.description} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					formName="images"
					accept="image/*"
					inputLabel={CHURCHES_INPUT_LABELS.images}
					bind:resetFiles
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select name="type">
					<option value="" disabled selected>{CHURCHES_INPUT_LABELS.type}</option>

					{#each churchTypes as churchType}
						<option value={churchType.value}>{churchType.text}</option>
					{/each}
				</select>
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
