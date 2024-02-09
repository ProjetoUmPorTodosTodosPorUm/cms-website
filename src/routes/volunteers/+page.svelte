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
	import type { VolunteerDto, ColumnCell, RowCell } from '$types'
	import { friendlyDateString } from '$utils'
	import { VOLUNTEERS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: volunteerData = data.apiData as VolunteerDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Voluntários',
		buttonText: 'Adicionar Voluntário',
		buttonLink: `/volunteers/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: VOLUNTEERS_INPUT_LABELS.firstName,
			key: 'firstName'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.email,
			key: 'email'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.joinedDate,
			key: 'joinedDate'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.occupation,
			key: 'occupation'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.church,
			key: 'church'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.priest,
			key: 'priest'
		},
		{
			label: VOLUNTEERS_INPUT_LABELS.observation,
			key: 'observation'
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

	$: collectionData = Object.entries(volunteerData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.firstName,
					key: 'firstName',
					value: `${item.firstName} ${item.lastName || ''}`
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.email,
					key: 'email',
					value: item.email
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.joinedDate,
					key: 'joinedData',
					value: item.joinedDate,
					transform: (value: string) => (value ? new Date(value).toLocaleDateString('pt-BR') : '')
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.occupation,
					key: 'occupation',
					value: item.occupation,
					isTag: true
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.church,
					key: 'church',
					value: item.church
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.priest,
					key: 'priest',
					value: item.priest
				},
				{
					label: VOLUNTEERS_INPUT_LABELS.observation,
					key: 'observation',
					value: item.observation,
					isModal: true
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
	<title>Voluntários</title>
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
