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
	import type { AnnouncementDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { ANNOUNCEMENTS_INPUT_LABEL, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: announcementData = data.apiData as AnnouncementDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Avisos',
		buttonText: 'Adicionar Aviso',
		buttonLink: `/announcements/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: ANNOUNCEMENTS_INPUT_LABEL.title,
			key: 'title'
		},
		{
			label: ANNOUNCEMENTS_INPUT_LABEL.message,
			key: 'message'
		},
		{
			label: ANNOUNCEMENTS_INPUT_LABEL.attachments,
			key: 'attachments'
		},
		{
			label: ANNOUNCEMENTS_INPUT_LABEL.fixed,
			key: 'fixed'
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

	$: collectionData = Object.entries(announcementData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: ANNOUNCEMENTS_INPUT_LABEL.title,
					key: 'title',
					value: item.title
				},
				{
					label: ANNOUNCEMENTS_INPUT_LABEL.message,
					key: 'message',
					value: item.message,
					isModal: true,
					modalModalHtml: true
				},
				{
					label: ANNOUNCEMENTS_INPUT_LABEL.attachments,
					key: 'attachments',
					value: item.attachments,
					isJson: true
				},
				{
					label: ANNOUNCEMENTS_INPUT_LABEL.fixed,
					key: 'fixed',
					value: item.fixed,
					isStatus: true,
					transform: (val) => (val ? SHARED.isStatus.true : SHARED.isStatus.false)
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
	<title>Avisos</title>
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
