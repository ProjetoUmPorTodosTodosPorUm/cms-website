<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { AnnouncementDto, FileDto } from '$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone'
	import BsPinAngle from 'svelte-icons-pack/bs/BsPinAngle'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.announcements.edit

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: announcementData = (data.apiData as AnnouncementDto) || (form?.apiData as AnnouncementDto)
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'announcements')
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
	const initialFiles = fromFilenameToFileDto(data.apiData.attachments) as FileDto[]
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
	>
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<div class="input">
				<Icon src={HiOutlineSpeakerphone} />
				<input
					bind:value={announcementData.title}
					name="title"
					placeholder={i18n.inputs.titleLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={announcementData.message}
					formName="message"
					placeholder={i18n.inputs.messageLabel()}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					files={initialFiles}
					formName="attachments"
					accept=".pdf"
					inputLabel={i18n.inputs.attachmentsLabel()}
				/>
			</div>
			<div class="input">
				<Icon src={BsPinAngle} />
				<div class="radio">
					<label for="#">{i18n.inputs.yes()}</label>
					<input bind:group={announcementData.fixed} name="fixed" type="radio" value={true} />
				</div>
				<div class="radio">
					<label for="#">{i18n.inputs.no()}</label>
					<input bind:group={announcementData.fixed} name="fixed" type="radio" value={false} />
				</div>
			</div>
			<FieldSelect value={announcementData.fieldId} />
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
