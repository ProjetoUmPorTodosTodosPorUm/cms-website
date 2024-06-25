<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, TinyMCEEditor, InputFiles, FieldSelect } from '$components'
	import type { ReportDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { ReportType } from '$enums'
	import { editSubmitFunction, fromFilenameToFileDto } from '$src/lib/utils'
	import { REPORTS_INPUT_LABELS, REPORT_TYPES } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlinePencil, HiOutlineBars3, HiOutlineCalendar, HiOutlineTag } from 'svelte-icons-pack/hi'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: reportData = (data.apiData as ReportDto) || (form?.apiData as ReportDto)
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
		name: 'Editar Relatório',
		buttonText: ''
	}

	// Form
	const initialFiles = fromFilenameToFileDto(data.apiData.attachments) as FileDto[]
	$: reportTypes = [
		{ value: 'ORDINARY', text: REPORT_TYPES.ordinary },
		{ value: 'SEMESTER', text: REPORT_TYPES.semester },
		{ value: 'ANNUAL', text: REPORT_TYPES.annual }
	]
	$: {
		reportData.month = reportData.type === ReportType.ANNUAL ? null : reportData.month
	}
</script>

<svelte:head>
	<title>Relatórios</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/put" use:enhance={editSubmitFunction} on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlinePencil} />
				<input value={reportData.title} name="title" placeholder={REPORTS_INPUT_LABELS.title} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineBars3} />
				<textarea
					value={reportData.shortDescription}
					name="shortDescription"
					placeholder={REPORTS_INPUT_LABELS.shortDescription}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<div class="input input-lg">
				<TinyMCEEditor value={reportData.text || ''} formName="message" placeholder={REPORTS_INPUT_LABELS.text} />
				<!-- file={form?.apiData?.file} -->
			</div>
			<div class="input input-lg">
				<InputFiles
					files={initialFiles}
					formName="attachments"
					accept=".pdf"
					inputLabel={REPORTS_INPUT_LABELS.attachments}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						value={reportData.month}
						name="month"
						placeholder={REPORTS_INPUT_LABELS.month}
						type="number"
						min="1"
						max="12"
						disabled={reportData.type == ReportType.ANNUAL}
					/>
				</div>
				<div class="number">
					<input
						value={reportData.year}
						name="year"
						placeholder={REPORTS_INPUT_LABELS.year}
						type="number"
						min="2000"
						max="2100"
					/>
				</div>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={reportData.type} name="type">
					<option value="" disabled selected>{REPORTS_INPUT_LABELS.type}</option>

					{#each reportTypes as reportType}
						<option value={reportType.value}>{reportType.text}</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={reportData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
