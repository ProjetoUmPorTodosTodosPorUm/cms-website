<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { WelcomedFamilyDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineInformationCircle from 'svelte-icons-pack/hi/HiOutlineInformationCircle'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['welcomed-families'].edit

	export let data: PageData
	export let form: ActionData
	$: welcomedFamilyData =
		(data.apiData as WelcomedFamilyDto) || (form?.apiData as WelcomedFamilyDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'welcomed-families')
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
					value={welcomedFamilyData.representative}
					name="representative"
					placeholder={i18n.inputs.representativeLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineInformationCircle} />
				<textarea
					value={welcomedFamilyData.observation}
					name="observation"
					placeholder={i18n.inputs.observationLabel()}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<FieldSelect value={welcomedFamilyData.fieldId} />
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
