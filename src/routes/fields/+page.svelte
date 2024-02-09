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
	import type { FieldDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { FIELDS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: fieldData = data.apiData as FieldDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Campos Missionários',
		buttonText: 'Adicionar Campo Missionário',
		buttonLink: `/fields/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: FIELDS_INPUT_LABELS.continent,
			key: 'continent'
		},
		{
			label: FIELDS_INPUT_LABELS.country,
			key: 'country'
		},
		{
			label: FIELDS_INPUT_LABELS.state,
			key: 'state'
		},
		{
			label: FIELDS_INPUT_LABELS.abbreviation,
			key: 'abbreviation'
		},
		{
			label: FIELDS_INPUT_LABELS.designation,
			key: 'designation'
		},
		{
			label: FIELDS_INPUT_LABELS.collectionPoints,
			key: 'collectionPoints'
		},
		{
			label: FIELDS_INPUT_LABELS.streetRelation,
			key: 'streetRelation'
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

	$: collectionData = Object.entries(fieldData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: FIELDS_INPUT_LABELS.continent,
					key: 'continent',
					value: item.continent
				},
				{
					label: FIELDS_INPUT_LABELS.country,
					key: 'country',
					value: item.country
				},
				{
					label: FIELDS_INPUT_LABELS.state,
					key: 'state',
					value: item.state
				},
				{
					label: FIELDS_INPUT_LABELS.abbreviation,
					key: 'abbreviation',
					value: item.abbreviation,
					isTag: true
				},
				{
					label: FIELDS_INPUT_LABELS.designation,
					key: 'designation',
					value: item.designation
				},
				{
					label: FIELDS_INPUT_LABELS.collectionPoints,
					key: 'collectionPoints',
					value: item.collectionPoints,
					isJson: true
				},
				{
					abel: FIELDS_INPUT_LABELS.streetRelation,
					key: 'streetRelation',
					value: item.streetRelation,
					isJson: true
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
	<title>Campos Missionários</title>
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
