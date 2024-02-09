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
	import type { WelcomedFamilyDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { WELCOMED_FAMILIES_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: welcomedFamilyData = data.apiData as WelcomedFamilyDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Famílias Acolhidas',
		buttonText: 'Adicionar Família Acolhida',
		buttonLink: `/welcomed-families/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: WELCOMED_FAMILIES_INPUT_LABELS.representative,
			key: 'representative'
		},
		{
			label: WELCOMED_FAMILIES_INPUT_LABELS.observation,
			key: 'observation'
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

	$: collectionData = Object.entries(welcomedFamilyData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: WELCOMED_FAMILIES_INPUT_LABELS.representative,
					key: 'representative',
					value: item.representative
				},
				{
					label: WELCOMED_FAMILIES_INPUT_LABELS.observation,
					key: 'observation',
					value: item.observation,
					isModal: true
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
	<title>Famílias Acolhidas</title>
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
