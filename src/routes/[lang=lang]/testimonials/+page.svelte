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
	import type { ColumnCell, RowCell, TestimonialDto } from '$types'
	import { friendlyDateString } from '$utils'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.testimonials.list
	$: sharedI18n = $LL.shared

	export let data: PageData
	export let form: ActionData

	$: testimonialData = data.apiData as TestimonialDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'testimonials')
		await loadNamespaceAsync(data.locale, 'shared')
		setLocale(data.locale)
	})

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText(),
		buttonLink: `/${data.locale}/testimonials/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: i18n.collectionHeader.nameLabel(),
			key: 'name'
		},
		{
			label: i18n.collectionHeader.emailLabel(),
			key: 'email'
		},
		{
			label: i18n.collectionHeader.textLabel(),
			key: 'text'
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

	$: collectionData = Object.entries(testimonialData).map(
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
					value: item.name
				},
				{
					label: i18n.collectionHeader.emailLabel(),
					key: 'email',
					value: item.email
				},
				{
					label: i18n.collectionHeader.textLabel(),
					key: 'text',
					value: item.text,
					isModal: true,
					modalModalHtml: true
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
