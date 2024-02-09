<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import { navigating } from '$app/stores'
	import type { ActionData, PageData } from './$types'
	import {
		AppContainer,
		AppContent,
		CollectionHeader,
		CollectionRow,
		CollectionRowPlaceholder
	} from '$components'
	import type { ReportDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { REPORTS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: reportData = data.apiData as ReportDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Relatórios',
		buttonText: 'Adicionar Relatório',
		buttonLink: `/reports/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: REPORTS_INPUT_LABELS.title,
			key: 'title'
		},
		{
			label: REPORTS_INPUT_LABELS.text,
			key: 'text'
		},
		{
			label: REPORTS_INPUT_LABELS.shortDescription,
			key: 'shortDescription'
		},
		{
			label: REPORTS_INPUT_LABELS.attachments,
			key: 'attachments'
		},
		{
			label: REPORTS_INPUT_LABELS.month,
			key: 'month'
		},
		{
			label: REPORTS_INPUT_LABELS.year,
			key: 'year'
		},
		{
			label: REPORTS_INPUT_LABELS.type,
			key: 'type'
		},
		{
			label: SHARED.collectionHeader.createdAtLabel,
			key: 'createdAt'
		},
		{
			label: SHARED.collectionHeader.updatedAtLabel,
			key: 'updatedAt'
		},
		{
			label: SHARED.collectionHeader.deletedLabel,
			key: 'deleted'
		}
	] as ColumnCell[]

	$: collectionData = Object.entries(reportData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: REPORTS_INPUT_LABELS.title,
					key: 'title',
					value: item.title
				},
				{
					label: REPORTS_INPUT_LABELS.text,
					key: 'text',
					value: item.text,
					isModal: true,
					modalModalHtml: true
				},
				{
					label: REPORTS_INPUT_LABELS.shortDescription,
					key: 'shortDescription',
					value: item.shortDescription,
					isModal: true
				},
				{
					label: REPORTS_INPUT_LABELS.attachments,
					key: 'attachments',
					value: item.attachments,
					isJson: true
				},
				{
					label: REPORTS_INPUT_LABELS.month,
					key: 'month',
					value: item.month
				},
				{
					label: REPORTS_INPUT_LABELS.year,
					key: 'year',
					value: item.year
				},
				{
					label: REPORTS_INPUT_LABELS.type,
					key: 'type',
					value: item.type,
					isTag: true
				},
				{
					label: SHARED.collectionHeader.createdAtLabel,
					key: 'createdAt',
					value: item.createdAt,
					transform: (value: string) => friendlyDateString(value, 'pt-BR')
				},
				{
					label: SHARED.collectionHeader.updatedAtLabel,
					key: 'updatedAt',
					value: item.updatedAt,
					transform: (value: string) => friendlyDateString(value, 'pt-BR')
				},
				{
					label: SHARED.collectionHeader.deletedLabel,
					key: 'deleted',
					value: item.deleted,
					transform: (value: string) => friendlyDateString(value, 'pt-BR')
				}
			] as RowCell[]
	)
</script>

<svelte:head>
	<title>Relatórios</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {totalCount} showBackButton={false} maxPage={totalPages}>
		<CollectionHeader columns={collectionHeader} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} />
		{/each}
		{#if collectionData.length === 0 && !!!$navigating}
			<CollectionRowPlaceholder
				buttonLink={appHeader.buttonLink}
				buttonText={appHeader.buttonText}
			/>
		{/if}
	</AppContent>
</AppContainer>
