<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.churches.add

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'churches')
		setLocale(data.locale)
	})

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
		name: i18n.appHeader.name(),
		buttonText: ''
	}

	// Form
	let resetFiles: () => void
	$: churchTypes = [
		{ value: 'PIONEER', text: i18n.churchTypes.pioneer() },
		{ value: 'EXPANSION', text: i18n.churchTypes.expansion() },
		{ value: 'SUPPORT', text: i18n.churchTypes.support() },
		{ value: 'RESPONSIBLE', text: i18n.churchTypes.responsible() }
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
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input name="name" placeholder={i18n.inputs.nameLabel()} autocomplete="off" />
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="description" placeholder={i18n.inputs.descriptionLabel()} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					formName="images"
					accept="image/*"
					inputLabel={i18n.inputs.imagesLabel()}
					bind:resetFiles
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select name="type">
					<option value="" disabled selected>{i18n.inputs.typeLabel()}</option>

					{#each churchTypes as churchType}
						<option value={churchType.value}>{churchType.text}</option>
					{/each}
				</select>
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
