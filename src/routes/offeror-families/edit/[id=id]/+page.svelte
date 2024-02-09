<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { OfferorFamilyDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'
	import { OFFEROR_FAMILIES_INPUT_LABELS, OFFEROR_FAMILIES_GROUPS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineHand from 'svelte-icons-pack/hi/HiOutlineHand'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'

	export let data: PageData
	export let form: ActionData
	$: offerorFamilyData = (data.apiData as OfferorFamilyDto) || (form?.apiData as OfferorFamilyDto)
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
		name: 'Editar Família Ofertante',
		buttonText: ''
	}

	// Form
	$: groups = [
		{ value: 'CHURCH', text: OFFEROR_FAMILIES_GROUPS.church },
		{ value: 'COMMUNITY', text: OFFEROR_FAMILIES_GROUPS.community },
		{ value: 'EXTERNAL', text: OFFEROR_FAMILIES_GROUPS.external }
	]
</script>

<svelte:head>
	<title>Famílias Ofertantes</title>
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
					bind:value={offerorFamilyData.representative}
					name="representative"
					placeholder={OFFEROR_FAMILIES_INPUT_LABELS.representative}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineHand} />
				<input
					bind:value={offerorFamilyData.commitment}
					name="commitment"
					placeholder={OFFEROR_FAMILIES_INPUT_LABELS.commitment}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={offerorFamilyData.churchDenomination}
					name="churchDenomination"
					placeholder={OFFEROR_FAMILIES_INPUT_LABELS.church}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<select bind:value={offerorFamilyData.group} name="group">
					<option value={null} disabled selected>{OFFEROR_FAMILIES_INPUT_LABELS.group}</option>

					{#each groups as group}
						<option value={group.value}>
							{group.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={offerorFamilyData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
