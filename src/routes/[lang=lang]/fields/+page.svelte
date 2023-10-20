<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import { onMount } from 'svelte'
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

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.fields.list
	$: sharedI18n = $LL.shared

	export let data: PageData
	export let form: ActionData

	$: fieldData = data.apiData as FieldDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'fields')
		await loadNamespaceAsync(data.locale, 'shared')
		setLocale(data.locale)
	})

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText(),
		buttonLink: `/${data.locale}/fields/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.continentLabel(),
			key: 'continent'
		},
		{
			label: i18n.collectionHeader.countryLabel(),
			key: 'country'
		},
		{
			label: i18n.collectionHeader.stateLabel(),
			key: 'state'
		},
		{
			label: i18n.collectionHeader.abbreviationLabel(),
			key: 'abbreviation'
		},
		{
			label: i18n.collectionHeader.designationLabel(),
			key: 'designation'
		},
		{
			label: i18n.collectionHeader.collectionPointsLabel(),
			key: 'collectionPoints'
		},
		{
			label: i18n.collectionHeader.streetRelationLabel(),
			key: 'streetRelation'
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

	$: collectionData = Object.entries(fieldData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.continentLabel(),
					key: 'continent',
					value: item.continent
				},
				{
					label: i18n.collectionHeader.countryLabel(),
					key: 'country',
					value: item.country
				},
				{
					label: i18n.collectionHeader.stateLabel(),
					key: 'state',
					value: item.state
				},
				{
					label: i18n.collectionHeader.abbreviationLabel(),
					key: 'abbreviation',
					value: item.abbreviation,
					isTag: true
				},
				{
					label: i18n.collectionHeader.designationLabel(),
					key: 'designation',
					value: item.designation
				},
				{
					label: i18n.collectionHeader.collectionPointsLabel(),
					key: 'collectionPoints',
					value: item.collectionPoints,
					isJson: true
				},
				{
					abel: i18n.collectionHeader.streetRelationLabel(),
					key: 'streetRelation',
					value: item.streetRelation,
					isJson: true
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
		showFilter={false}
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
