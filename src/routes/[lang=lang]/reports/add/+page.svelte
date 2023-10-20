<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData, PageData } from './$types'
	import { ReportType } from '$enums'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlinePencil from 'svelte-icons-pack/hi/HiOutlinePencil'
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.reports.add

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'reports')
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
	$: reportTypes = [
		{ value: 'ORDINARY', text: i18n.reportTypes.ordinary() },
		{ value: 'SEMESTER', text: i18n.reportTypes.semester() },
		{ value: 'ANNUAL', text: i18n.reportTypes.annual() }
	]
	let type: ReportType | string = ''
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
				<Icon src={HiOutlinePencil} />
				<input name="title" placeholder={i18n.inputs.titleLabel()} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					name="shortDescription"
					placeholder={i18n.inputs.shortDescriptionLabel()}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="text" placeholder={i18n.inputs.textLabel()} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					formName="attachments"
					accept="application/pdf"
					inputLabel={i18n.inputs.attachmentsLabel()}
					bind:resetFiles
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						name="month"
						placeholder={i18n.inputs.monthLabel()}
						type="number"
						min="1"
						max="12"
						disabled={type == ReportType.ANNUAL}
					/>
				</div>
				<div class="number">
					<input
						name="year"
						placeholder={i18n.inputs.yearLabel()}
						type="number"
						min="2000"
						max="2100"
					/>
				</div>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={type} name="type">
					<option value="" disabled selected>{i18n.inputs.typeLabel()}</option>

					{#each reportTypes as reportType}
						<option value={reportType.value}>{reportType.text}</option>
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
