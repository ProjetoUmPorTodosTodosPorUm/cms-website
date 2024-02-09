<script lang="ts">
	import '$scss/dashboard.scss'
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
	import { USERS_INPUT_LABELS, SHARED } from '$constants'

	export let data: PageData
	export let form: ActionData

	$: userData = data.apiData as UserDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Usuários',
		buttonText: 'Adicionar Usuários',
		buttonLink: `/users/add`
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: USERS_INPUT_LABELS.firstName,
			key: 'firstName'
		},
		{
			label: USERS_INPUT_LABELS.lastName,
			key: 'lastName'
		},
		{
			label: USERS_INPUT_LABELS.email,
			key: 'email'
		},
		{
			label: USERS_INPUT_LABELS.role,
			key: 'role'
		},
		{
			label: USERS_INPUT_LABELS.lastAccess,
			key: 'lastAccess'
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

	$: collectionData = Object.entries(userData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: USERS_INPUT_LABELS.firstName,
					key: 'firstName',
					value: item.firstName
				},
				{
					label: USERS_INPUT_LABELS.lastName,
					key: 'lastName',
					value: item.lastName ?? USERS_INPUT_LABELS.lastNamePlaceholder
				},
				{
					label: USERS_INPUT_LABELS.email,
					key: 'email',
					value: item.email
				},
				{
					label: USERS_INPUT_LABELS.role,
					key: 'role',
					value: item.role,
					isTag: true
				},
				{
					label: USERS_INPUT_LABELS.lastAccess,
					key: 'lastAccess',
					value: item.lastAccess,
					transform: (value: string) => friendlyDateString(value, 'pt-BR')
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
	<title>Usuários</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{totalCount}
		showBackButton={false}
		showFilter={false}
		maxPage={totalPages}
	>
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
