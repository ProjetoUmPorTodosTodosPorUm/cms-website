<script lang="ts">
	import defaultAvatarSrc from '$assets/images/fallback-avatar.webp'
	import { page } from '$app/stores'
	import { PUBLIC_FILES_URL } from '$env/static/public'
	import BaseInputFile from './base-input-file.svelte'
	import type { FileDto } from '$types'

	export let file: FileDto = {} as FileDto
	export let formName = ''
	export let accept = '.jpg,.jpeg,.png,.bmp,.gif,.webp'
	export let altText = ''
	export let inputLabel = ''

	$: filename = $page.form?.apiData?.file?.name || file?.name || ''
	$: imageSrc = filename ? `${PUBLIC_FILES_URL}/${filename}` : defaultAvatarSrc

	let openFileDialogBox: () => void
	function openFileDialog(ev: Event) {
		ev.preventDefault()
		openFileDialogBox()
	}

	let openFileRemoveDialogBox: (fileName: string) => boolean
	function openFileRemoveDialog(ev: Event, fileName: string) {
		ev.preventDefault()
		return openFileRemoveDialogBox(fileName)
	}

	function proxyFileDialog(ev: Event) {
		ev.preventDefault()
		if (filename.length > 0) {
			if (openFileRemoveDialog(ev, filename)) {
				openFileDialog(ev)
			}
		} else {
			openFileDialog(ev)
		}
	}
</script>

<div class="image-preview">
	<img src={imageSrc} alt={altText} />
	<div class="overlay">
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#" on:click={proxyFileDialog}>{inputLabel}</a>

		<BaseInputFile
			bind:openFileDialogBox
			bind:openFileRemoveDialogBox
			{formName}
			{accept}
			{filename}
		/>
	</div>
</div>
