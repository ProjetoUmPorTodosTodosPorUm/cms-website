<script lang="ts">
	import '$scss/dashboard.scss'
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
	import type { UserDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.users.list
	$: sharedI18n = $LL.shared

	export let data: PageData
	export let form: ActionData

	$: userData = data.apiData as UserDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'users')
		await loadNamespaceAsync(data.locale, 'shared')
		setLocale(data.locale)
	})

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText(),
		buttonLink: `/${data.locale}/users/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.firstNameLabel(),
			key: 'firstName'
		},
		{
			label: i18n.collectionHeader.lastNameLabel(),
			key: 'lastName'
		},
		{
			label: i18n.collectionHeader.emailLabel(),
			key: 'email'
		},
		{
			label: i18n.collectionHeader.roleLabel(),
			key: 'role'
		},
		{
			label: i18n.collectionHeader.lastAccessLabel(),
			key: 'lastAccess'
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

	$: collectionData = Object.entries(userData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: i18n.collectionHeader.firstNameLabel(),
					key: 'firstName',
					value: item.firstName
				},
				{
					label: i18n.collectionHeader.lastNameLabel(),
					key: 'lastName',
					value: item.lastName ?? i18n.lastNamePlaceholder()
				},
				{
					label: i18n.collectionHeader.emailLabel(),
					key: 'email',
					value: item.email
				},
				{
					label: i18n.collectionHeader.roleLabel(),
					key: 'role',
					value: item.role,
					isTag: true
				},
				{
					label: i18n.collectionHeader.lastAccessLabel(),
					key: 'lastAccess',
					value: item.lastAccess,
					transform: (value: string) => friendlyDateString(value, data.locale)
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
