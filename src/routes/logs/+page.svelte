<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'
	import type { LogDto, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import type { PageData } from './$types'
	import { LOGS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData

	$: logData = data.apiData as LogDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = data.messages as any[]

	// App Header
	$: appHeader = {
		name: 'Logs'
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: LOGS_INPUT_LABELS.ip,
			key: 'ip'
		},
		{
			label: LOGS_INPUT_LABELS.method,
			key: 'method'
		},
		{
			label: LOGS_INPUT_LABELS.url,
			key: 'url'
		},
		{
			label: LOGS_INPUT_LABELS.body,
			key: 'body'
		},
		{
			label: LOGS_INPUT_LABELS.files,
			key: 'files'
		},
		{
			label: LOGS_INPUT_LABELS.query,
			key: 'query'
		},
		{
			label: LOGS_INPUT_LABELS.statusCode,
			key: 'statusCode'
		},
		{
			label: LOGS_INPUT_LABELS.user,
			key: 'user'
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

	$: collectionData = Object.entries(logData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: LOGS_INPUT_LABELS.ip,
					key: 'ip',
					value: item.ip
				},
				{
					label: LOGS_INPUT_LABELS.method,
					key: 'method',
					value: item.method,
					isTag: true
				},
				{
					label: LOGS_INPUT_LABELS.url,
					key: 'url',
					value: item.url
				},
				{
					label: LOGS_INPUT_LABELS.body,
					key: 'body',
					value: item.body,
					isJson: true
				},
				{
					label: LOGS_INPUT_LABELS.files,
					key: 'files',
					value: item.files,
					isJson: true
				},
				{
					label: LOGS_INPUT_LABELS.query,
					key: 'query',
					value: item.query
				},
				{
					label: LOGS_INPUT_LABELS.statusCode,
					key: 'statusCode',
					value: item.statusCode
				},
				{
					label: LOGS_INPUT_LABELS.user,
					key: 'user',
					value: item.user,
					isJson: true
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
	<title>Logs</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		showFilter={false}
		maxPage={totalPages}
	>
		<CollectionHeader columns={collectionHeader} showOptions={false} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} showOptions={false} />
		{/each}
	</AppContent>
</AppContainer>
