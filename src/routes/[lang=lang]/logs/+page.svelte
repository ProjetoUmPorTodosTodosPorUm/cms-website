<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'

	import { onMount } from 'svelte'
	import type { LogDto, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import type { PageData } from './$types'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.logs.list
	$: sharedI18n = $LL.shared

	export let data: PageData

	$: logData = data.apiData as LogDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = data.messages as any[]

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'logs')
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
			label: i18n.collectionHeader.ipLabel(),
			key: 'ip'
		},
		{
			label: i18n.collectionHeader.methodLabel(),
			key: 'method'
		},
		{
			label: i18n.collectionHeader.urlLabel(),
			key: 'url'
		},
		{
			label: i18n.collectionHeader.bodyLabel(),
			key: 'body'
		},
		{
			label: i18n.collectionHeader.filesLabel(),
			key: 'files'
		},
		{
			label: i18n.collectionHeader.queryLabel(),
			key: 'query'
		},
		{
			label: i18n.collectionHeader.statusCodeLabel(),
			key: 'statusCode'
		},
		{
			label: i18n.collectionHeader.userLabel(),
			key: 'user'
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

	$: collectionData = Object.entries(logData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.ipLabel(),
					key: 'ip',
					value: item.ip
				},
				{
					label: i18n.collectionHeader.methodLabel(),
					key: 'method',
					value: item.method,
					isTag: true
				},
				{
					label: i18n.collectionHeader.urlLabel(),
					key: 'url',
					value: item.url
				},
				{
					label: i18n.collectionHeader.bodyLabel(),
					key: 'body',
					value: item.body,
					isJson: true
				},
				{
					label: i18n.collectionHeader.filesLabel(),
					key: 'files',
					value: item.files,
					isJson: true
				},
				{
					label: i18n.collectionHeader.queryLabel(),
					key: 'query',
					value: item.query
				},
				{
					label: i18n.collectionHeader.statusCodeLabel(),
					key: 'statusCode',
					value: item.statusCode
				},
				{
					label: i18n.collectionHeader.userLabel(),
					key: 'user',
					value: item.user,
					isJson: true
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
		<CollectionHeader columns={collectionHeader} showOptions={false} locale={data.locale} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} showOptions={false} locale={data.locale} />
		{/each}
	</AppContent>
</AppContainer>
