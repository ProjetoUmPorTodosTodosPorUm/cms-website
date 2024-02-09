<script lang="ts">
	import '$scss/dashboard.scss'
	import type { PageData } from './$types'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'
	import type { TokenDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { TOKENS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData

	$: tokenData = data.apiData as TokenDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = data.messages as any[]

	// App Header
	$: appHeader = {
		name: 'Tokens'
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: TOKENS_INPUT_LABELS.token,
			key: 'token'
		},
		{
			label: TOKENS_INPUT_LABELS.email,
			key: 'email'
		},
		{
			label: TOKENS_INPUT_LABELS.used,
			key: 'used'
		},
		{
			label: TOKENS_INPUT_LABELS.type,
			key: 'tokenType'
		},
		{
			label: TOKENS_INPUT_LABELS.payload,
			key: 'payload'
		},
		{
			label: TOKENS_INPUT_LABELS.expiration,
			key: 'expiration'
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

	$: collectionData = Object.entries(tokenData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: TOKENS_INPUT_LABELS.token,
					key: 'token',
					value: item.token
				},
				{
					label: TOKENS_INPUT_LABELS.email,
					key: 'email',
					value: item.email,
					isTag: true
				},
				{
					label: TOKENS_INPUT_LABELS.used,
					key: 'used',
					value: item.used,
					isTag: true
				},
				{
					label: TOKENS_INPUT_LABELS.type,
					key: 'tokenType',
					value: item.tokenType,
					isTag: true
				},
				{
					label: TOKENS_INPUT_LABELS.payload,
					key: 'payload',
					value: item.payload,
					isJson: true
				},
				{
					label: TOKENS_INPUT_LABELS.expiration,
					key: 'expiration',
					value: item.expiration,
					transform: (value: number) => friendlyDateString(new Date(Date.now() + value), 'pt-BR')
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
	<title>Tokens</title>
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
