<script lang="ts">
	import { page } from '$app/stores'
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: sharedI18n = $LL.shared

	onMount(async () => {
		await loadNamespaceAsync($page.data.locale, 'shared')
		setLocale($page.data.locale)
	})

	export let formName = ''
	export let filename = ''
	export let required = false
	export let accept = '.jpg,.jpeg,.png,.pdf,.doc'
	export let multiple = false

	let fileUploadInputSubmitFormRef: HTMLInputElement
	let fileUploadInputRef: HTMLInputElement

	let fileRemoveInputSubmitFormRef: HTMLInputElement
	let fileRemoveInputRef: HTMLInputElement

	export const openFileDialogBox = () => {
		fileUploadInputRef.click()
	}

	function onFileChange(event: Event) {
		fileUploadInputSubmitFormRef.click()
	}

	export const openFileRemoveDialogBox = (fName: string) => {
		const remove = confirm(sharedI18n.remove.files({ name: fName }))

		if (remove) {
			fileRemoveInputRef.value = fName
			fileRemoveInputSubmitFormRef.click()
		}

		return remove
	}
</script>

<!-- Start Body -->
<slot name="body" />
<input value={filename} hidden={true} name={formName} type="text" autocomplete="off" {required} />
<!-- End Body-->

<!-- Start File Upload Form -->
<form
	method="POST"
	action={multiple ? '?/bulkFile' : '?/file'}
	enctype="multipart/form-data"
	use:enhance
>
	<input
		bind:this={fileUploadInputRef}
		on:change={onFileChange}
		name={multiple ? 'files' : 'file'}
		type="file"
		hidden
		{accept}
		{multiple}
	/>
	<input bind:this={fileUploadInputSubmitFormRef} type="submit" hidden />
</form>
<!-- End File Upload Form -->

<!-- Start File Remove Form -->
<form method="POST" action="?/fileRemove" use:enhance>
	<input bind:this={fileRemoveInputRef} name="filename" type="text" hidden />

	<input bind:this={fileRemoveInputSubmitFormRef} type="submit" hidden />
</form>
<!-- End File Remove Form-->
