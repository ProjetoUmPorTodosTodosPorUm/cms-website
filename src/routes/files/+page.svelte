<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'

	import type { RowCell, FileDto } from '$types'
	import { friendlyDateString } from '$utils'
	import type { ActionData, PageData } from './$types'
	import { FILES_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	const sizeFormat = new Intl.NumberFormat('en', {
		notation: 'compact',
		style: 'unit',
		unit: 'byte',
		unitDisplay: 'narrow'
	})

	$: fileData = data.apiData as FileDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	let showEdit = false

	// App Header
	$: appHeader = {
		name: 'Arquivos'
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: FILES_INPUT_LABELS.name,
			key: 'name'
		},
		{
			label: FILES_INPUT_LABELS.mimeType,
			key: 'mimeType'
		},
		{
			label: FILES_INPUT_LABELS.size,
			key: 'size'
		},
		{
			label: SHARED.collectionHeader.createdAtLabel,
			key: 'createdAt'
		},
		{
			label: SHARED.collectionHeader.deletedLabel,
			key: 'deleted'
		}
	]

	// Collection Data
	$: collectionData = Object.entries(fileData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: FILES_INPUT_LABELS.name,
					key: 'name',
					value: item.name,
					isStatic: true
				},
				{
					label: FILES_INPUT_LABELS.mimeType,
					key: 'mimeType',
					value: item.mimeType,
					isTag: true
				},
				{
					label: FILES_INPUT_LABELS.size,
					key: 'size',
					value: item.size,
					transform: sizeFormat.format
				},
				{
					label: SHARED.collectionHeader.createdAtLabel,
					key: 'createdAt',
					value: item.createdAt,
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
	<title>Arquivos</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		showFilter={false}
		maxPage={totalPages}
	>
		<CollectionHeader columns={collectionHeader} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} {showEdit} />
		{/each}
	</AppContent>
</AppContainer>
