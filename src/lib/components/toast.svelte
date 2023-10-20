<script lang="ts">
	import '$scss/components/toast.scss'
	import { createEventDispatcher, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { page } from '$app/stores'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX'

	export let id = 0
	export let message = ''
	export let variant = 'danger'
	export let silent = false

	export let isOpen = true
	export let autoHide = true
	export let duration = 3 // in seconds

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.toast

	onMount(async () => {
		await loadNamespaceAsync($page.data.locale, 'toast')
		setLocale($page.data.locale)

		if (silent) {
			console.debug(message)
		}
	})

	const dispatch = createEventDispatcher()

	function close() {
		isOpen = false
		dispatch('close', id)
	}

	if (autoHide) {
		setTimeout(() => {
			close()
		}, duration * 1000)
	}
</script>

{#if isOpen && !silent}
	<div in:fade out:fade class={`toast bg-${variant}`}>
		<div class="toast-body">
			<p>{message}</p>
		</div>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="#" on:click|preventDefault={close}>
			<Icon src={HiOutlineX} className="btn-close toast-close" />
		</a>
	</div>
{/if}
