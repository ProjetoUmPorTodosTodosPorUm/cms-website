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
	import type { OfferorFamilyDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { OFFEROR_FAMILIES_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: offerorFamilyData = data.apiData as OfferorFamilyDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Famílias Ofertantes',
		buttonText: 'Adicionar Famílias Ofertantes',
		buttonLink: `/offeror-families/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: OFFEROR_FAMILIES_INPUT_LABELS.representative,
			key: 'representative'
		},
		{
			label: OFFEROR_FAMILIES_INPUT_LABELS.commitment,
			key: 'commitment'
		},
		{
			label: OFFEROR_FAMILIES_INPUT_LABELS.church,
			key: 'churchDenomination'
		},
		{
			label: OFFEROR_FAMILIES_INPUT_LABELS.group,
			key: 'group'
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

	$: collectionData = Object.entries(offerorFamilyData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: OFFEROR_FAMILIES_INPUT_LABELS.representative,
					key: 'representative',
					value: item.representative
				},
				{
					label: OFFEROR_FAMILIES_INPUT_LABELS.commitment,
					key: 'commitment',
					value: item.commitment
				},
				{
					label: OFFEROR_FAMILIES_INPUT_LABELS.church,
					key: 'churchDenomination',
					value: item.churchDenomination
				},
				{
					label: OFFEROR_FAMILIES_INPUT_LABELS.group,
					key: 'group',
					value: item.group,
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
	<title>Famílias Ofertantes</title>
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
