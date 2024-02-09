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
	import type { CollaboratorDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { RECOVERY_HOUSES_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: collaboratorData = data.apiData as CollaboratorDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Casas de Recuperação',
		buttonText: 'Adicionar Casa de Recuperação',
		buttonLink: `/recovery-houses/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: RECOVERY_HOUSES_INPUT_LABELS.title,
			key: 'title'
		},
		{
			label: RECOVERY_HOUSES_INPUT_LABELS.description,
			key: 'description'
		},
		{
			label: RECOVERY_HOUSES_INPUT_LABELS.image,
			key: 'image'
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

	$: collectionData = Object.entries(collaboratorData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: RECOVERY_HOUSES_INPUT_LABELS.title,
					key: 'title',
					value: item.title
				},
				{
					label: RECOVERY_HOUSES_INPUT_LABELS.description,
					key: 'description',
					value: item.description,
					isModal: true,
					modalModalHtml: true
				},
				{
					label: RECOVERY_HOUSES_INPUT_LABELS.image,
					key: 'image',
					value: item.image,
					isStatic: true,
					transform: (value: string) => value ?? ''
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
	<title>Casas de Recuperação</title>
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
