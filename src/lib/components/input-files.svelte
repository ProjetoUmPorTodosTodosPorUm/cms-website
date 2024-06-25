<script lang="ts">
	import { page } from '$app/stores'
	import { PUBLIC_FILES_URL } from '$env/static/public'
	import type { FileDto } from '$types'
	import BaseInputFile from './base-input-file.svelte'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlinePaperClip } from 'svelte-icons-pack/hi'

	export let files: FileDto[] = []
	export let formName = ''
	export let accept = 'audio/*,image/*,.pdf'
	export let inputLabel = ''

	function onUploadFiles() {
		if ($page.form?.apiData?.files) {
			for (let i = 0; i < $page.form?.apiData?.files.length; i++) {
				files = [...files, $page.form?.apiData?.files[i]]
			}
		}
	}

	function onRemoveFile() {
		if ($page.form?.apiData?.fileRemoved) {
			const fileRemoveName = $page.form?.apiData?.fileRemoved.name
			for (let i = 0; i < files.length; i++) {
				if (files[i].name == fileRemoveName) {
					files.splice(i, 1)
					files = files
				}
			}
		}
	}

	export const resetFiles = () => {
		files = []
	}

	$: $page.form?.apiData?.files, onUploadFiles()
	$: $page.form?.apiData?.fileRemoved, onRemoveFile()
	$: filenames = files.map((f) => f.name) || []

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
</script>

<BaseInputFile
	bind:openFileDialogBox
	bind:openFileRemoveDialogBox
	{formName}
	{accept}
	filename={filenames.join(',')}
	multiple={true}
>
	<div slot="body" class="input-files">
		<Icon src={HiOutlinePaperClip} />
		{#if files.length > 0}
			<div class="files">
				{#each files as file (file.name)}
					<div class="item">
						<a href={`${PUBLIC_FILES_URL}/${file.name}`}>{file.name}</a>
						<button class="btn-close" on:click={(ev) => openFileRemoveDialog(ev, file.name)} />
					</div>
				{/each}
			</div>
		{:else}
			<p>{inputLabel}</p>
		{/if}
		<button on:click={openFileDialog}>Escolher Arquivos</button>
	</div>
</BaseInputFile>
