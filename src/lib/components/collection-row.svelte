<script lang="ts">
	import type { RowCell } from '$lib/types';
	import Icon from 'svelte-icons-pack';
	import FiEdit from 'svelte-icons-pack/fi/FiEdit';
	import FiTrash2 from 'svelte-icons-pack/fi/FiTrash2';
	import { createEventDispatcher, onMount } from 'svelte';
	import JSONTree from 'svelte-json-tree';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import type { Locales } from '$src/i18n/i18n-types';

	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['collection-row'];
	export let locale: Locales;

	// Component Data
	export let showOptions = true;
	export let showEdit = true;
	export let showDeleted = false;
	export let selected = false;
	export let rowCells: RowCell[];

	// Document Data
	let id = rowCells.filter((row) => row.key === 'id')[0].value;
	let deletedRow = rowCells.filter((row) => row.key === 'deleted')[0];
	$: isDeleted = rowCells.filter((row) => row.key === 'deleted')[0].value !== null;
	$: isDeleted, (selected = false);

	// Events
	const dispatch = createEventDispatcher();
	const edit = () => dispatch('edit', id);
	const remove = () =>
		dispatch('remove', {
			id,
			data: rowCells.reduce((pRow, cRow) => {
				return {
					...pRow,
					[cRow.key]: cRow.transform ? cRow.transform(cRow.value) : cRow.value
				};
			}, {})
		});
	const modalOpen = (key: string) =>
		dispatch('modalopen', {
			id,
			data: rowCells.reduce((pRow, cRow) => {
				return {
					...pRow,
					[cRow.key]: cRow.transform ? cRow.transform(cRow.value) : cRow.value
				};
			}, {}),
			key
		});
	const select = () => dispatch('select', id);

	onMount(async () => {
		await loadNamespaceAsync(locale, 'collection-row');
		setLocale(locale);
	});
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
				{:else if rowCell.textLimit}
					{#if rowCell.value?.length > rowCell.textLimit}
						{#if rowCell.isModal}
							<!-- svelte-ignore a11y-invalid-attribute -->
							<a href="" on:click={() => modalOpen(rowCell.key)}
								>{rowCell.value.substring(0, rowCell.textLimit)}...</a
							>
						{:else}
							{rowCell.value.substring(0, rowCell.textLimit)}...
						{/if}
					{:else if rowCell.isModal}
						<!-- svelte-ignore a11y-invalid-attribute -->
						<a href="" on:click={() => modalOpen(rowCell.key)}>{rowCell.value ?? ''}</a>
					{:else}
						{rowCell.value ?? ''}
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
				<button class="edit" title={i18n.editButtonTitle()} on:click={edit} disabled={isDeleted}>
					<Icon src={FiEdit} />
				</button>
			{/if}

			<button class="remove" title={i18n.removeButtonTitle()} on:click={remove} disabled={isDeleted}>
				<Icon src={FiTrash2} />
			</button>
		</div>
	{/if}

	{#if showDeleted}
		<div class="product-cell">
			<input
				bind:checked={selected}
				on:change={select}
				disabled={!isDeleted}
				type="checkbox"
				name="selected"
				id="selected"
			/>
		</div>
	{/if}
</div>
