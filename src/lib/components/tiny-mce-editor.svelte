<script lang="ts">
	import { PUBLIC_FILES_URL } from '$env/static/public'
	import { enhance } from '$app/forms'
	import Editor from '@tinymce/tinymce-svelte'
	import type { FileDto } from '$types'
	import { onMount } from 'svelte'
	import { delay } from '$utils'

	export let placeholder = ''
	export let formName = ''
	export let value = ''
	export let required = false
	export let file: FileDto | undefined = undefined

	let inputSubmitFormRef: HTMLInputElement
	let fileInputRef: HTMLInputElement
	$: tinyMCEFilename = file?.name || ''

	$: conf = {
		min_height: 300,
		plugins: [
			'link',
			'autolink',
			'accordion',
			'code',
			'lists',
			'advlist',
			'charmap',
			'emoticons',
			'codesample',
			'directionality',
			'fullscreen',
			'help',
			'image',
			'insertdatetime',
			'media',
			'preview',
			'quickbars',
			'searchreplace',
			'table',
			'visualblocks',
			'wordcount'
		],
		toolbar: ['ltr rtl link bullist numlist | image media | fullscreen preview'],
		link_default_target: '_blank',
		link_default_protocol: 'https',
		insertdatetime_formats: ['%H:%M:%S', '%d-%m-%Y', '%I:%M:%S %p', '%d/%m/%Y'],
		placeholder,
		image_title: true,
		file_picker_types: 'image',
		file_picker_callback: filePickerCallback,
		convert_urls: false,
		language: 'pt_BR',
		branding: false,
		resize: 'both'
	}

	onMount(() => {
		fileInputRef.addEventListener('change', (ev) => {
			inputSubmitFormRef.click()
		})
	})

	async function filePickerCallback(callback: Function) {
		fileInputRef.click()
		await isFilenameAvailable()

		callback(`${PUBLIC_FILES_URL}/${tinyMCEFilename}`, {
			title: tinyMCEFilename
		})
		tinyMCEFilename = ''
	}

	async function isFilenameAvailable() {
		while (tinyMCEFilename === '') {
			console.debug('wainting for tinyMCEFilename...')
			await delay(300)
		}
		return true
	}
</script>

<!-- Start TinyMCEEditor -->
<Editor bind:value scriptSrc="/tinymce/tinymce.min.js" {conf} />
<input {value} hidden={true} name={formName} type="text" autocomplete="off" {required} />
<!-- End TinyMCEEditor -->

<!-- Start Image Upload Form -->
<form method="POST" action="?/file" enctype="multipart/form-data" use:enhance>
	<input bind:this={fileInputRef} name="file" type="file" accept="image/*" hidden />
	<input bind:this={inputSubmitFormRef} type="submit" hidden />
</form>
<!-- End Image Upload Form -->
