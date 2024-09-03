<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import type { ActionData, PageData } from './$types'
	import { AppContainer, AppContent, CollectionHeader, CollectionRow } from '$components'
	import type { ColumnCell, RowCell, ContactDto } from '$types'
	import { friendlyDateString } from '$utils'
	import { CONTACTS_INPUT_LABELS, SHARED } from '$constants'
	import { PUBLIC_FILES_URL } from '$env/static/public'

	export let data: PageData
	export let form: ActionData

	$: contactData = data.apiData as ContactDto[]
	$: totalCount = data.totalCount
	$: totalPages = data.totalPages
	$: messages = form?.messages || (data.messages as any[])

	// App Header
	$: appHeader = {
		name: 'Contatos'
	}

	// Collection Header
	$: collectionHeader = [
		{
			label: CONTACTS_INPUT_LABELS.name,
			key: 'name'
		},
		{
			label: CONTACTS_INPUT_LABELS.email,
			key: 'email'
		},
		{
			label: CONTACTS_INPUT_LABELS.message,
			key: 'message'
		},
		{
			label: CONTACTS_INPUT_LABELS.attachments,
			key: 'attachments'
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

	$: collectionData = Object.entries(contactData).map(
		([key, item]) =>
			[
				{
					label: 'id',
					key: 'id',
					value: item.id
				},
				{
					label: CONTACTS_INPUT_LABELS.name,
					key: 'name',
					value: item.name
				},
				{
					label: CONTACTS_INPUT_LABELS.email,
					key: 'email',
					value: item.email
				},
				{
					label: CONTACTS_INPUT_LABELS.message,
					key: 'message',
					value: item.message,
					isModal: true,
					modalModalHtml: true,
					transform: (value: string, ctx) => {
						const attachments: string[] = ctx.filter((item) => item.key === 'attachments')[0].value

						if(attachments.length > 0) {

						return `
							${value}
							<ul style="list-style:none;padding:0;margin: 1rem 0 0;">
								${attachments.map((attachment) => {
									return `<li><a style="text-decoration:underline;" href="${PUBLIC_FILES_URL}/${attachment}" target="_blank">${attachment}</a></li>`
								}).join(' ')}
								
							</ul>
						`
						} else {
							return value
						}
					}
				},
				{
					label: CONTACTS_INPUT_LABELS.attachments,
					key: 'attachments',
					value: item.attachments,
					isJson: true
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
	<title>Contatos</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {totalCount} showBackButton={false} showFilter={false} maxPage={totalPages}>
		<CollectionHeader columns={collectionHeader} />
		{#each collectionData as row, i (row[0].value)}
			<CollectionRow rowCells={row} showEdit={false} />
		{/each}
	</AppContent>
</AppContainer>
