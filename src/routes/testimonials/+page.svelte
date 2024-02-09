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
	import type { ColumnCell, RowCell, TestimonialDto } from '$types'
	import { friendlyDateString } from '$utils'
	import { TESTIMONIALS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: testimonialData = data.apiData as TestimonialDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Testemunhos',
		buttonText: 'Adicionar Testemunho',
		buttonLink: `/testimonials/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: TESTIMONIALS_INPUT_LABELS.name,
			key: 'name'
		},
		{
			label: TESTIMONIALS_INPUT_LABELS.email,
			key: 'email'
		},
		{
			label: TESTIMONIALS_INPUT_LABELS.text,
			key: 'text'
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

	$: collectionData = Object.entries(testimonialData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: TESTIMONIALS_INPUT_LABELS.name,
					key: 'name',
					value: item.name
				},
				{
					label: TESTIMONIALS_INPUT_LABELS.email,
					key: 'email',
					value: item.email
				},
				{
					label: TESTIMONIALS_INPUT_LABELS.text,
					key: 'text',
					value: item.text,
					isModal: true,
					modalModalHtml: true
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
	<title>Testemunhos</title>
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
