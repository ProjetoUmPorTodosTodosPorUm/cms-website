<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFile, FieldSelect } from '$components'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.collaborators.add

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'collaborators')
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
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<input name="title" placeholder={i18n.inputs.titleLabel()} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="description" placeholder={i18n.inputs.descriptionLabel()} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFile formName="image" accept="image/*" inputLabel={i18n.inputs.imageLabel()} />
			</div>
			<FieldSelect />
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
