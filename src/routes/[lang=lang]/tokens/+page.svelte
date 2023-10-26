<script lang="ts">
	import '$scss/dashboard.scss'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'
	import type { TokenDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.tokens.list
	$: sharedI18n = $LL.shared

	export let data: PageData

	$: tokenData = data.apiData as TokenDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = data.messages as any[]

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'tokens')
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
			label: i18n.collectionHeader.tokenLabel(),
			key: 'token'
		},
		{
			label: i18n.collectionHeader.emailLabel(),
			key: 'email'
		},
		{
			label: i18n.collectionHeader.usedLabel(),
			key: 'used'
		},
		{
			label: i18n.collectionHeader.typeLabel(),
			key: 'tokenType'
		},
		{
			label: i18n.collectionHeader.payloadLabel(),
			key: 'payload'
		},
		{
			label: i18n.collectionHeader.expirationLabel(),
			key: 'expiration'
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

	$: collectionData = Object.entries(tokenData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.tokenLabel(),
					key: 'token',
					value: item.token
				},
				{
					label: i18n.collectionHeader.emailLabel(),
					key: 'email',
					value: item.email,
					isTag: true
				},
				{
					label: i18n.collectionHeader.usedLabel(),
					key: 'used',
					value: item.used,
					isTag: true
				},
				{
					label: i18n.collectionHeader.typeLabel(),
					key: 'tokenType',
					value: item.tokenType,
					isTag: true
				},
				{
					label: i18n.collectionHeader.payloadLabel(),
					key: 'payload',
					value: item.payload,
					isJson: true
				},
				{
					label: i18n.collectionHeader.expirationLabel(),
					key: 'expiration',
					value: item.expiration,
					transform: (value: number) =>
						friendlyDateString(new Date(Date.now() + value), data.locale)
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
		<CollectionHeader columns={collectionHeader} showOptions={false} locale={data.locale} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} showOptions={false} locale={data.locale} />
		{/each}
	</AppContent>
</AppContainer>
