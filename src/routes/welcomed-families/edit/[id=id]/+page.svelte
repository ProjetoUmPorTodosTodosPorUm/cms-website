<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { WelcomedFamilyDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'
	import { WELCOMED_FAMILIES_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineInformationCircle from 'svelte-icons-pack/hi/HiOutlineInformationCircle'

	export let data: PageData
	export let form: ActionData
	$: welcomedFamilyData =
		(data.apiData as WelcomedFamilyDto) || (form?.apiData as WelcomedFamilyDto)
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
		name: 'Editar Família Acolhida',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Famílias Acolhidas</title>
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
					value={welcomedFamilyData.representative}
					name="representative"
					placeholder={WELCOMED_FAMILIES_INPUT_LABELS.representative}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineInformationCircle} />
				<textarea
					value={welcomedFamilyData.observation}
					name="observation"
					placeholder={WELCOMED_FAMILIES_INPUT_LABELS.observation}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<FieldSelect value={welcomedFamilyData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
