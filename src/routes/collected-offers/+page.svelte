<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import { getContext } from 'svelte'
	import { navigating } from '$app/stores'
	import type { ActionData, PageData } from './$types'
	import {
		AppContainer,
		AppContent,
		CollectionHeader,
		CollectionRow,
		CollectionRowPlaceholder
	} from '$components'
	import type { MonthlyOfferDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import type { SettingsStore } from '$src/lib/stores/settings'
	import { COLLECT_OFFERS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: monthlyFamilyData = data.apiData as MonthlyOfferDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	let settingsStore = getContext<SettingsStore>('settings')
	// @TODO implement
	let searchType: 'text' | 'number' = 'number'
	$: Currency = Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: settingsStore.get('currency')
	})

	// App Header
	$: appHeader = {
		name: 'Ofertas Coletadas',
		buttonText: 'Adicionar Ofertas Coletadas',
		buttonLink: `/collected-offers/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: COLLECT_OFFERS_INPUT_LABELS.month,
			key: 'month'
		},
		{
			label: COLLECT_OFFERS_INPUT_LABELS.year,
			key: 'year'
		},
		{
			label: COLLECT_OFFERS_INPUT_LABELS.foodQnt,
			key: 'foodQnt'
		},
		{
			label: COLLECT_OFFERS_INPUT_LABELS.monetaryValue,
			key: 'monetaryValue'
		},
		{
			label: COLLECT_OFFERS_INPUT_LABELS.othersQnt,
			key: 'othersQnt'
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

	$: collectionData = Object.entries(monthlyFamilyData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: COLLECT_OFFERS_INPUT_LABELS.month,
					key: 'month',
					value: item.month
				},
				{
					label: COLLECT_OFFERS_INPUT_LABELS.year,
					key: 'year',
					value: item.year
				},
				{
					label: COLLECT_OFFERS_INPUT_LABELS.foodQnt,
					key: 'foodQnt',
					value: item.foodQnt
				},
				{
					label: COLLECT_OFFERS_INPUT_LABELS.monetaryValue,
					key: 'monetaryValue',
					value: item.monetaryValue,
					transform: (val: number) => Currency.format(val)
				},
				{
					label: COLLECT_OFFERS_INPUT_LABELS.othersQnt,
					key: 'othersQnt',
					value: item.othersQnt
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
	<title>Ofertas Coletadas</title>
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
