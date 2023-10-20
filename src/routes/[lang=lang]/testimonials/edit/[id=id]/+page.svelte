<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, FieldSelect } from '$components'
	import type { TestimonialDto } from '$types'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	import { editSubmitFunction } from '$src/lib/utils'
	$: i18n = $LL.testimonials.edit

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: testimonialData = (data.apiData as TestimonialDto) || (form?.apiData as TestimonialDto)
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'testimonials')
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
					value={testimonialData.name}
					name="name"
					placeholder={i18n.inputs.nameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					value={testimonialData.email}
					name="email"
					placeholder={i18n.inputs.emailLabel()}
					type="email"
					autocomplete="off"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor
					value={testimonialData.text}
					formName="text"
					placeholder={i18n.inputs.textLabel()}
				/>
				<!-- file={form?.apiData?.file} -->
			</div>
			<FieldSelect value={testimonialData.fieldId} />
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
