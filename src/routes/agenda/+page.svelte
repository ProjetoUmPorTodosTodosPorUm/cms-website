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
	import type { AgendaDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { AGENDA_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: agendaData = data.apiData as AgendaDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Agenda',
		buttonText: 'Adicionar Evento',
		buttonLink: `/agenda/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: AGENDA_INPUT_LABELS.title,
			key: 'title'
		},
		{
			label: AGENDA_INPUT_LABELS.message,
			key: 'message'
		},
		{
			label: AGENDA_INPUT_LABELS.attachments,
			key: 'attachments'
		},
		{
			label: AGENDA_INPUT_LABELS.date,
			key: 'date'
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

	$: collectionData = Object.entries(agendaData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: AGENDA_INPUT_LABELS.title,
					key: 'title',
					value: item.title
				},
				{
					label: AGENDA_INPUT_LABELS.message,
					key: 'message',
					value: item.message,
					isModal: true,
					modalModalHtml: true
				},
				{
					label: AGENDA_INPUT_LABELS.attachments,
					key: 'attachments',
					value: item.attachments,
					isJson: true
				},
				{
					label: AGENDA_INPUT_LABELS.date,
					key: 'date',
					value: item.date,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: SHARED.collectionHeader.createdAtLabel,
					key: 'createdAt',
					value: item.createdAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: SHARED.collectionHeader.updatedAtLabel,
					key: 'updatedAt',
					value: item.updatedAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: SHARED.collectionHeader.deletedLabel,
					key: 'deleted',
					value: item.deleted,
					transform: (value: string) => friendlyDateString(value, data.locale)
				}
			] as RowCell[]
	)
</script>

<svelte:head>
	<title>Agenda</title>
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
