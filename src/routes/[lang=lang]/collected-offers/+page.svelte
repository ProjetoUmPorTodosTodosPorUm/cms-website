<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import { getContext, onMount } from 'svelte'
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

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['collected-offers'].list
	$: sharedI18n = $LL.shared

	export let data: PageData
	export let form: ActionData

	$: monthlyFamilyData = data.apiData as MonthlyOfferDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	let settingsStore = getContext<SettingsStore>('settings')
	// @TODO implement
	let searchType: 'text' | 'number' = 'number'
	$: Currency = Intl.NumberFormat(data.locale, {
		style: 'currency',
		currency: settingsStore.get('currency')
	})

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'collected-offers')
		await loadNamespaceAsync(data.locale, 'shared')
		setLocale(data.locale)
	})

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText(),
		buttonLink: `/${data.locale}/collected-offers/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.monthLabel(),
			key: 'month'
		},
		{
			label: i18n.collectionHeader.yearLabel(),
			key: 'year'
		},
		{
			label: i18n.collectionHeader.foodQntLabel(),
			key: 'foodQnt'
		},
		{
			label: i18n.collectionHeader.monetaryValueLabel(),
			key: 'monetaryValue'
		},
		{
			label: i18n.collectionHeader.othersQntLabel(),
			key: 'othersQnt'
		},
		{
			label: sharedI18n.collectionHeader.createdAtLabel(),
			key: 'createdAt'
		},
		{
			label: sharedI18n.collectionHeader.updatedAtLabel(),
			key: 'updatedAt'
		},
		{
			label: sharedI18n.collectionHeader.deletedLabel(),
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
					label: i18n.collectionHeader.monthLabel(),
					key: 'month',
					value: item.month
				},
				{
					label: i18n.collectionHeader.yearLabel(),
					key: 'year',
					value: item.year
				},
				{
					label: i18n.collectionHeader.foodQntLabel(),
					key: 'foodQnt',
					value: item.foodQnt
				},
				{
					label: i18n.collectionHeader.monetaryValueLabel(),
					key: 'monetaryValue',
					value: item.monetaryValue,
					transform: (val: number) => Currency.format(val)
				},
				{
					label: i18n.collectionHeader.othersQntLabel(),
					key: 'othersQnt',
					value: item.othersQnt
				},
				{
					label: sharedI18n.collectionHeader.createdAtLabel(),
					key: 'createdAt',
					value: item.createdAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: sharedI18n.collectionHeader.updatedAtLabel(),
					key: 'updatedAt',
					value: item.updatedAt,
					transform: (value: string) => friendlyDateString(value, data.locale)
				},
				{
					label: sharedI18n.collectionHeader.deletedLabel(),
					key: 'deleted',
					value: item.deleted,
					transform: (value: string) => friendlyDateString(value, data.locale)
				}
			] as RowCell[]
	)
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		maxPage={totalPages}
		locale={data.locale}
	>
		<CollectionHeader columns={collectionHeader} locale={data.locale} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} locale={data.locale} />
		{/each}
		{#if collectionData.length === 0 && !!!$navigating}
			<CollectionRowPlaceholder
				locale={data.locale}
				buttonLink={appHeader.buttonLink}
				buttonText={appHeader.buttonText}
			/>
		{/if}
	</AppContent>
</AppContainer>
