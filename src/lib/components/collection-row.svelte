<script lang="ts">
	import type { RowCell } from '$types'
	import { onMount } from 'svelte'
	import JSONTree from 'svelte-json-tree'
	import { PUBLIC_STATIC_PATH } from '$env/static/public'
	import { apiPathnameFromUrl } from '$utils'
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import { Modal } from '$components'

	import Icon from 'svelte-icons-pack'
	import FiEdit from 'svelte-icons-pack/fi/FiEdit'
	import FiTrash2 from 'svelte-icons-pack/fi/FiTrash2'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import type { Locales } from '$i18n/i18n-types'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['collection-row']
	$: sharedI18n = $LL.shared

	export let locale: Locales

	// Component Data
	export let showOptions = true
	export let showEdit = true
	export let showRemove = true
	export let selected = false
	export let rowCells: RowCell[]
	$: showDeleted = $page.url.searchParams.get('deleted') == 'true' ? true : false
	let apiPathname = apiPathnameFromUrl($page.url)
	let removeSubmitRef: HTMLInputElement

	// Document Data
	let id = rowCells.filter((row) => row.key === 'id')[0].value
	let deletedRow = rowCells.filter((row) => row.key === 'deleted')[0]
	$: isDeleted = rowCells.filter((row) => row.key === 'deleted')[0].value !== null
	$: isDeleted, (selected = false)

	// Modal
	const textLimit = 100
	let showModal = false
	let modal = {
		title: '',
		text: '',
		html: false
	}

	function onModalOpen(rowCell: RowCell) {
		modal.title = rowCell.label
		modal.text = rowCell.value
		modal.html = rowCell.modalModalHtml || false
		showModal = true
	}

	function onCloseModal() {
		showModal = false
	}

	onMount(async () => {
		await loadNamespaceAsync(locale, 'collection-row')
		setLocale(locale)
	})

	function onRemove() {
		const data = rowCells.reduce((pRow, cRow) => {
			return {
				...pRow,
				[cRow.key]: cRow.transform ? cRow.transform(cRow.value) : cRow.value
			}
		}, {})
		const remove = confirm(
			sharedI18n.remove[apiPathname as keyof typeof sharedI18n.remove]({
				...data
			} as any)
		)

		if (remove) {
			removeSubmitRef.click()
		}
	}
</script>

<div class="products-row">
	{#each rowCells as rowCell}
		{#if !['id', 'deleted'].includes(rowCell.key)}
			<div class="product-cell">
				<span class="cell-label">{rowCell.label}:</span>
				{#if rowCell.isStatus}
					<span class={`status ${rowCell.value ? 'active' : 'disabled'}`}>
						{rowCell.transform
							? rowCell.transform(rowCell.value)
							: rowCell.value
							? i18n.isStatusActiveText()
							: i18n.isStatusDisabledText()}
					</span>
				{:else if rowCell.isLink}
					{#if rowCell.value}
						<a href={rowCell.value} target="_blank" rel="noreferrer">{rowCell.value}</a>
					{:else}
						{rowCell.value}
					{/if}
				{:else if rowCell.isStatic}
					{#if rowCell.value}
						<a href={`${PUBLIC_STATIC_PATH}/${rowCell.value}`} target="_blank" rel="noreferrer"
							>{rowCell.value}</a
						>
					{:else}
						{rowCell.transform ? rowCell.transform(rowCell.value) : rowCell.value}
					{/if}
				{:else if rowCell.isTag}
					<span class="tag">
						{rowCell.transform ? rowCell.transform(rowCell.value) : rowCell.value}
					</span>
				{:else if rowCell.isJson}
					<JSONTree value={rowCell.value} />
				{:else if rowCell.isModal}
					{#if rowCell.value?.length > textLimit}
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="" on:click={() => onModalOpen(rowCell)}
							>{rowCell.value.substring(0, textLimit)}...</a
						>
					{:else}
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="" on:click={() => onModalOpen(rowCell)}>{rowCell.value ?? ''}</a>
					{/if}
				{:else}
					{rowCell.transform ? rowCell.transform(rowCell.value) : rowCell.value ?? ''}
				{/if}
			</div>
		{/if}
	{/each}

	{#if showDeleted}
		{#if isDeleted}
			<div class="product-cell">
				{deletedRow.transform ? deletedRow.transform(deletedRow.value) : deletedRow.value}
			</div>
		{:else}
			<div class="product-cell">
				<span class="tag">{i18n.notDeletedText()}</span>
			</div>
		{/if}
	{/if}

	{#if showOptions}
		<div class="product-cell">
			{#if showEdit}
				<a
					href={`/${locale}/${apiPathname}/edit/${id}`}
					class="edit"
					title={i18n.editButtonTitle()}
					style={isDeleted ? 'opacity:.3;cursor:not-allowed' : ''}
					on:click={isDeleted ? (e) => e.preventDefault() : () => ({})}
				>
					<Icon src={FiEdit} />
				</a>
			{/if}

			{#if showRemove}
				<form use:enhance method="POST" action="?/remove">
					<input type="text" name="id" value={id} hidden={true} />
					<input bind:this={removeSubmitRef} type="submit" hidden={true} />
				</form>
				<button
					class="remove"
					title={i18n.removeButtonTitle()}
					on:click={onRemove}
					disabled={isDeleted}
				>
					<Icon src={FiTrash2} />
				</button>
			{/if}
		</div>
	{/if}

	{#if showDeleted}
		<div class="product-cell">
			<input
				id="selected"
				name="ids"
				type="checkbox"
				form="restore"
				value={id}
				disabled={!isDeleted}
				bind:checked={selected}
			/>
			<input
				name="ids"
				type="checkbox"
				form="hard-remove"
				value={id}
				hidden={true}
				bind:checked={selected}
			/>
		</div>
	{/if}
</div>

{#if showModal}
	<Modal show={true} on:close={onCloseModal}>
		<h2 slot="header">{modal.title}</h2>
		{#if modal.html}
			{@html modal.text}
		{:else}
			<p>{modal.text}</p>
		{/if}
	</Modal>
{/if}
