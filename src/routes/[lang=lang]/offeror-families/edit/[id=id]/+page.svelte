<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { OfferorFamilyDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineHand from 'svelte-icons-pack/hi/HiOutlineHand'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['offeror-families'].edit

	export let data: PageData
	export let form: ActionData
	$: offerorFamilyData = (data.apiData as OfferorFamilyDto) || (form?.apiData as OfferorFamilyDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'offeror-families')
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
	$: groups = [
		{ value: 'CHURCH', text: i18n.groups.church() },
		{ value: 'COMMUNITY', text: i18n.groups.community() },
		{ value: 'EXTERNAL', text: i18n.groups.external() }
	]
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
					placeholder={i18n.inputs.representativeLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineHand} />
				<input
					bind:value={offerorFamilyData.commitment}
					name="commitment"
					placeholder={i18n.inputs.commitmentLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={offerorFamilyData.churchDenomination}
					name="churchDenomination"
					placeholder={i18n.inputs.churchLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<select bind:value={offerorFamilyData.group} name="group">
					<option value={null} disabled selected>{i18n.inputs.groupLabel()}</option>

					{#each groups as group}
						<option value={group.value}>
							{group.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={offerorFamilyData.fieldId} />
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
