<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { PUBLIC_STATIC_PATH } from '$env/static/public'
	import BaseInputFile from './base-input-file.svelte'
	import type { FileDto } from '$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlinePaperClip from 'svelte-icons-pack/hi/HiOutlinePaperClip'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: sharedI18n = $LL.shared

	export let file: FileDto = {} as FileDto
	export let formName = ''
	export let accept = '.jpg,.jpeg,.png,.pdf,.doc'
	export let inputLabel = ''

	onMount(async () => {
		await loadNamespaceAsync($page.data.locale, 'shared')
		setLocale($page.data.locale)
	})

	function onRemoveFile() {
		if ($page.form?.apiData?.fileRemoved) {
			file = {} as FileDto
		}
	}

	$: $page.form?.apiData?.fileRemoved, onRemoveFile()

	let openFileDialogBox: () => void
	function openFileDialog(ev: Event) {
		ev.preventDefault()
		openFileDialogBox()
	}

	let openFileRemoveDialogBox: (fileName: string) => boolean
	function openFileRemoveDialog(ev: Event, fileName: string) {
		ev.preventDefault()
		openFileRemoveDialogBox(fileName)
	}

	$: filename = ($page.form?.apiData?.file?.name as string) || file?.name || ''
</script>

<BaseInputFile bind:openFileDialogBox bind:openFileRemoveDialogBox {formName} {accept} {filename}>
	<div slot="body" class="input-file">
		<Icon src={HiOutlinePaperClip} />
		<div>
			{#if filename}
				<a href={`${PUBLIC_STATIC_PATH}/${filename}`} target="_blank" title={filename}
					>{filename.substring(0, 15)}</a
				>
				<button class="btn-close" on:click={(ev) => openFileRemoveDialog(ev, filename)} />
			{:else}
				<p>{inputLabel}</p>
			{/if}
		</div>
		<button on:click={openFileDialog}>{sharedI18n.inputFile.chooseFile()}</button>
	</div>
</BaseInputFile>
