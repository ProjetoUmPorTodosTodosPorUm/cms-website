<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { ReportType } from '$enums'
	import { REPORTS_INPUT_LABELS, REPORT_TYPES } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlinePencil, HiOutlineBars3, HiOutlineCalendar, HiOutlineTag } from 'svelte-icons-pack/hi'

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
		name: 'Adicionar Relatório',
		buttonText: ''
	}

	// Form
	let resetFiles: () => void
	$: reportTypes = [
		{ value: 'ORDINARY', text: REPORT_TYPES.ordinary },
		{ value: 'SEMESTER', text: REPORT_TYPES.semester },
		{ value: 'ANNUAL', text: REPORT_TYPES.annual }
	]
	let type: ReportType | string = ''
</script>

<svelte:head>
	<title>Relatórios</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlinePencil} />
				<input name="title" placeholder={REPORTS_INPUT_LABELS.title} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineBars3} />
				<textarea
					name="shortDescription"
					placeholder={REPORTS_INPUT_LABELS.shortDescription}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor formName="text" placeholder={REPORTS_INPUT_LABELS.text} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					formName="attachments"
					accept="application/pdf"
					inputLabel={REPORTS_INPUT_LABELS.attachments}
					bind:resetFiles
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						name="month"
						placeholder={REPORTS_INPUT_LABELS.month}
						type="number"
						min="1"
						max="12"
						disabled={type == ReportType.ANNUAL}
					/>
				</div>
				<div class="number">
					<input name="year" placeholder={REPORTS_INPUT_LABELS.year} type="number" min="2000" max="2100" />
				</div>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={type} name="type">
					<option value="" disabled selected>{REPORTS_INPUT_LABELS.type}</option>

					{#each reportTypes as reportType}
						<option value={reportType.value}>{reportType.text}</option>
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
