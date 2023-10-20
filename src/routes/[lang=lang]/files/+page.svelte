<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'

	import { onMount } from 'svelte'
	import type { RowCell, FileDto } from '$types'
	import { friendlyDateString } from '$utils'
	import type { ActionData, PageData } from './$types'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.files.list
	$: sharedI18n = $LL.shared

	export let data: PageData
	export let form: ActionData

	const sizeFormat = new Intl.NumberFormat('en', {
		notation: 'compact',
		style: 'unit',
		unit: 'byte',
		unitDisplay: 'narrow'
	})

	$: fileData = data.apiData as FileDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	let showEdit = false

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'files')
		await loadNamespaceAsync(data.locale, 'shared')
		setLocale(data.locale)
	})

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name()
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.nameLabel(),
			key: 'name'
		},
		{
			label: i18n.collectionHeader.mimeTypeLabel(),
			key: 'mimeType'
		},
		{
			label: i18n.collectionHeader.sizeLabel(),
			key: 'size'
		},
		{
			label: sharedI18n.collectionHeader.createdAtLabel(),
			key: 'createdAt'
		},
		{
			label: sharedI18n.collectionHeader.deletedLabel(),
			key: 'deleted'
		}
	]

	// Collection Data
	$: collectionData = Object.entries(fileData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.nameLabel(),
					key: 'name',
					value: item.name,
					isStatic: true
				},
				{
					label: i18n.collectionHeader.mimeTypeLabel(),
					key: 'mimeType',
					value: item.mimeType,
					isTag: true
				},
				{
					label: i18n.collectionHeader.sizeLabel(),
					key: 'size',
					value: item.size,
					transform: sizeFormat.format
				},
				{
					label: sharedI18n.collectionHeader.createdAtLabel(),
					key: 'createdAt',
					value: item.createdAt,
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
			<CollectionRow rowCells={row} locale={data.locale} {showEdit} />
		{/each}
	</AppContent>
</AppContainer>
