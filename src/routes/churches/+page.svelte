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
	import type { ChurchDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { CHURCHES_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: churchData = data.apiData as ChurchDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Igrejas em Unidade',
		buttonText: 'Adicionar Igreja em unidade',
		buttonLink: `/churches/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: CHURCHES_INPUT_LABELS.name,
			key: 'name'
		},
		{
			label: CHURCHES_INPUT_LABELS.description,
			key: 'description'
		},
		{
			label: CHURCHES_INPUT_LABELS.images,
			key: 'images'
		},
		{
			label: CHURCHES_INPUT_LABELS.type,
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

	$: collectionData = Object.entries(churchData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: CHURCHES_INPUT_LABELS.name,
					key: 'name',
					value: item.name
				},
				{
					label: CHURCHES_INPUT_LABELS.description,
					key: 'description',
					value: item.description,
					isModal: true,
					modalModalHtml: true
				},
				{
					label: CHURCHES_INPUT_LABELS.images,
					key: 'images',
					value: item.images,
					isJson: true
				},
				{
					label: CHURCHES_INPUT_LABELS.type,
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
	<title>Igrejas em Unidade</title>
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
